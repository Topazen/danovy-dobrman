using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace UcetnictviSite.Pages
{
    public class IndexModel : PageModel
    {
        private readonly IConfiguration _config;
        public string Lang { get; set; } = "cs";
        public Dictionary<string, string> Texts { get; set; } = new();
        
        [BindProperty]
        [Required(ErrorMessage = "Jméno je povinné")]
        public string? Name { get; set; }

        [BindProperty]
        [Required(ErrorMessage = "Email je povinný")]
        [EmailAddress(ErrorMessage = "Neplatná emailová adresa")]
        public string? Email { get; set; }
        
        [BindProperty]
        public string? Phone { get; set; }

        [BindProperty]
        public string? Message { get; set; }

        [BindProperty]
        public List<IFormFile>? Attachments { get; set; }

        [BindProperty]
        public string? RecaptchaResponse { get; set; }

        public string? Alert { get; set; }
        
        public string RecaptchaSiteKey => _config["Recaptcha:SiteKey"] ?? "YOUR_RECAPTCHA_SITE_KEY";

        public IndexModel(IConfiguration configuration)
        {
            _config = configuration;
        }

        public IActionResult OnGet()
        {
            Lang = "cs";
            LoadTexts(Lang);
            return Page();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            Lang = "cs";
            LoadTexts(Lang);

            // Verify reCAPTCHA
            var recaptchaResponse = Request.Form["g-recaptcha-response"].ToString();
            if (!await VerifyRecaptcha(recaptchaResponse ?? string.Empty))
            {
                Alert = "Prosím ověřte, že nejste robot.";
                return Page();
            }

            if (!ModelState.IsValid)
            {
                Alert = Texts["ErrorMissingFields"];
                return Page();
            }

            // Validate file attachments
            if (Attachments != null && Attachments.Count > 0)
            {
                if (Attachments.Count > 5)
                {
                    Alert = "Maximálně 5 příloh povoleno.";
                    return Page();
                }

                foreach (var file in Attachments)
                {
                    if (file.Length > 10 * 1024 * 1024) // 10 MB limit
                    {
                        Alert = $"Soubor {file.FileName} je příliš velký. Maximum je 10 MB.";
                        return Page();
                    }
                }
            }

            try
            {
                // For now, just save locally since SMTP is not configured
                // You can configure SMTP settings in appsettings.json later
                
                var smtpSection = _config.GetSection("Smtp");
                if (smtpSection.Exists() && !string.IsNullOrEmpty(smtpSection["Host"]))
                {
                    var host = smtpSection["Host"];
                    var port = int.Parse(smtpSection["Port"] ?? "587");
                    var user = smtpSection["User"];
                    var pass = smtpSection["Pass"];
                    var from = smtpSection["From"] ?? user;
                    var to = smtpSection["To"] ?? "configure@example.com";

                    if (string.IsNullOrEmpty(from) || string.IsNullOrEmpty(to))
                    {
                        throw new System.InvalidOperationException("Email configuration is missing From or To address");
                    }

                    using var mail = new MailMessage();
                    mail.From = new MailAddress(from);
                    mail.To.Add(to);
                    mail.Subject = $"Nová poptávka - ({Name ?? "Neuvedeno"})";
                    mail.Body = $"Jméno: {Name ?? "Neuvedeno"}\nEmail: {Email ?? "Neuvedeno"}\nTelefon: {Phone ?? "Neuvedeno"}\nZpráva:\n{Message ?? ""}";

                    // Add file attachments
                    if (Attachments != null && Attachments.Count > 0)
                    {
                        foreach (var file in Attachments)
                        {
                            if (file.Length > 0)
                            {
                                var memoryStream = new System.IO.MemoryStream();
                                await file.CopyToAsync(memoryStream);
                                memoryStream.Position = 0;
                                mail.Attachments.Add(new Attachment(memoryStream, file.FileName, file.ContentType));
                                // Attachment disposes the stream when MailMessage is disposed
                            }
                        }
                    }

                    using var client = new SmtpClient(host, port)
                    {
                        Credentials = new NetworkCredential(user, pass),
                        EnableSsl = bool.Parse(smtpSection["EnableSsl"] ?? "true")
                    };
                    await client.SendMailAsync(mail);
                    Alert = Texts["SuccessSend"];
                }
                else
                {
                    // SMTP not configured — demo mode
                    Alert = "Demo režim: formulář by byl odeslán. Nakonfigurujte SMTP v appsettings.json.";
                }
            }
            catch (System.Exception ex)
            {
                Alert = Texts["ErrorSend"] + " " + ex.Message;
            }

            return Page();
        }

        private void LoadTexts(string lang)
        {
            Texts = new Dictionary<string, string>
            {
                // Page Meta
                ["Title"] = "Vedení účetnictví — Profesionální služby",
                ["Description"] = "Profesionální vedení účetnictví, daňové poradenství a mzdové služby. Kontaktujte nás pro nabídku.",

                // Form Fields
                ["SelectService"] = "Vyberte službu",
                ["ErrorMissingFields"] = "Prosím vyplňte všechna povinná pole.",
                ["ErrorSend"] = "Při odesílání zprávy došlo k chybě.",
                ["SavedLocal"] = "Vaše zpráva byla uložena lokálně.",
                ["SuccessSend"] = "Vaše zpráva byla úspěšně odeslána.",
                ["FieldName"] = "Jméno*",
                ["FieldEmail"] = "Email*",
                ["FieldPhone"] = "Telefon",
                ["FieldService"] = "Služba*",
                ["FieldMessage"] = "Zpráva",
                ["SendButton"] = "Odeslat",
                ["CallButton"] = "Zavolat",
                ["HeroTitle"] = "Vedení účetnictví bez starostí",
                ["HeroSubtitle"] = "Osobní přístup, digitalizace dokladů a online přístup k účetnictví.",

                // Our Approach
                ["ApproachTitle"] = "Jak pracujeme",
                ["Approach1_Title"] = "Moderní technologie",
                ["Approach1_Text"] = "Používáme nejnovější účetní software a bezpečné cloudové úložiště pro neustálý přístup k vašim datům.",
                ["Approach2_Title"] = "Bezpečnost dat",
                ["Approach2_Text"] = "Bankovní úroveň šifrování a denní zálohy chrání vaše citlivé finanční informace v souladu s předpisy.",
                ["Approach3_Title"] = "Chytrá automatizace",
                ["Approach3_Text"] = "Naše automatizované systémy se starají o rutinní úkoly, což nám umožňuje soustředit se na strategické finanční plánování.",

                // Team Image
                ["TeamImageAlt"] = "Náš tým při práci",
                ["TeamImageText"] = "Společně vytváříme efektivní řešení pro vaše podnikání",

                // Services
                ["OrderNow"] = "Objednat službu",
                ["OurServices"] = "Naše služby",
                ["ServicesTitle"] = "Co nabízíme",
                ["OrderService"] = "Objednat službu",
                ["Service1_Title"] = "Vedení účetnictví",
                ["Service1_Text"] = "Kompletní vedení účetnictví pro firmy a OSVČ, pravidelné uzávěrky.",
                ["Service2_Title"] = "Daňové poradenství",
                ["Service2_Text"] = "Optimalizace daní, pomoc s daňovým přiznáním a kontrolami.",
                ["Service3_Title"] = "Mzdové služby",
                ["Service3_Text"] = "Zpracování mezd, odvodů a zaměstnanecké agendy.",

                ["OrderTitle"] = "Pošlete nám poptávku",
                ["FieldName"] = "Vaše jméno",
                ["FieldEmail"] = "E-mail",
                ["FieldPhone"] = "Telefon (volitelné)",
                ["FieldService"] = "Vyberte službu",
                ["FieldMessage"] = "Zpráva (volitelné)",

                // Testimonials
                ["TestimonialsTitle"] = "Co říkají naši klienti",
                ["ShowReviews"] = "Zobrazit celé recenze",
                ["HideReviews"] = "Skrýt recenze",
                ["ShowPricing"] = "Zobrazit všechny detaily",
                ["HidePricing"] = "Skrýt detaily",
                ["ShowSteps"] = "Zobrazit všechny kroky",
                ["HideSteps"] = "Skrýt kroky",
                ["ShowServices"] = "Zobrazit všechny služby",
                ["HideServices"] = "Skrýt služby",
                ["Testimonial1_Short"] = "Nejlepší účetní služby, jaké jsme kdy měli.",
                ["Testimonial1_Full"] = "Přechod na vaše služby byl hladký a profesionální. Oceňujeme především rychlou komunikaci a online přístup k dokumentům. Díky vám máme konečně perfektní přehled o financích.",
                ["Testimonial1_Author"] = "Martin Novák, majitel e-shopu",
                ["Testimonial2_Short"] = "Profesionální přístup a skvělá komunikace.",
                ["Testimonial2_Full"] = "Jako OSVČ jsem měla obavy z účetnictví, ale s vaší pomocí je to naprosto jednoduché. Vždy mi poradíte a vysvětlíte vše srozumitelně. Doporučuji všem!",
                ["Testimonial2_Author"] = "Jana Svobodová, OSVČ",
                ["Testimonial3_Short"] = "Spolehlivý partner pro náš business.",
                ["Testimonial3_Full"] = "Pracujeme s vámi již třetím rokem a jsme maximálně spokojeni. Oceňujeme především proaktivní přístup a optimalizaci daní, díky které jsme ušetřili spoustu peněz.",
                ["Testimonial3_Author"] = "Petr Dvořák, CEO technologické firmy",

                // Pricing
                ["PricingTitle"] = "Ceník služeb",
                ["PricingPopular"] = "Nejoblíbenější",
                ["Pricing1_Title"] = "Start",
                ["Pricing1_Price"] = "od 1 500 Kč/měsíc",
                ["Pricing1_Brief"] = "Pro začínající OSVČ a malé firmy",
                ["Pricing2_Title"] = "Business",
                ["Pricing2_Price"] = "od 2 200 Kč/měsíc",
                ["Pricing2_Brief"] = "Pro střední firmy a rozvíjející se OSVČ",
                ["Pricing3_Title"] = "Enterprise",
                ["Pricing3_Price"] = "od 2 800 Kč/měsíc",
                ["Pricing3_Brief"] = "Pro velké firmy s komplexními požadavky",

                // FAQ
                ["FAQTitle"] = "Často kladené otázky",
                ["FAQ1_Question"] = "Jak rychle odpovíte na mé dotazy?",
                ["FAQ1_Answer"] = "Standardně odpovídáme do 2 hodin v pracovní době (Po-Pá 8-17h). Naši klienti s Business a Enterprise balíčkem mají prioritní podporu s reakcí do 30 minut.",
                ["FAQ2_Question"] = "Jaké dokumenty potřebuji pro zahájení spolupráce?",
                ["FAQ2_Answer"] = "Pro OSVČ potřebujeme živnostenský list a přístup k bankovnímu účtu. Pro s.r.o. navíc výpis z obchodního rejstříku a zakladatelské dokumenty. Vše můžete zaslat elektronicky.",
                ["FAQ3_Question"] = "Pracujete i s malými firmami a začínajícími podnikateli?",
                ["FAQ3_Answer"] = "Ano! Máme speciální Start balíček právě pro začínající OSVČ a malé firmy. Pomůžeme vám s nastavením účetnictví od samého začátku.",
                ["FAQ4_Question"] = "Co je zahrnuto v ceně?",
                ["FAQ4_Answer"] = "Každý balíček zahrnuje kompletní vedení účetnictví, online přístup, pravidelné reporty a komunikaci s úřady. Detailní rozpis služeb najdete u každého cenového balíčku výše.",
                ["FAQ5_Question"] = "Můžu změnit balíček později?",
                ["FAQ5_Answer"] = "Samozřejmě! Balíček můžete kdykoliv upgradovat nebo downgraduovat podle aktuálních potřeb vašeho podnikání. Změna je účinná od následujícího měsíce.",

                // Process Timeline
                ["ProcessTitle"] = "Jak to funguje",
                ["Process1_Title"] = "Úvodní konzultace",
                ["Process1_Brief"] = "Nezávazná schůzka zdarma",
                ["Process1_Full"] = "Během první schůzky si probereme vaše potřeby, typ podnikání a aktuální stav účetnictví. Navrhneme vám nejvhodnější řešení a odpovíme na všechny vaše otázky. Konzultace je zcela zdarma a nezávazná.",
                ["Process2_Title"] = "Příprava a nastavení",
                ["Process2_Brief"] = "Sběr dokumentů a nastavení systému",
                ["Process2_Full"] = "Po podpisu smlouvy získáme přístup k potřebným dokumentům a nastavíme účetní systém. Provedeme kompletní analýzu vašeho stávajícího stavu a zajistíme hladký přechod bez přerušení provozu.",
                ["Process3_Title"] = "Zahájení spolupráce",
                ["Process3_Brief"] = "Kompletní převzetí účetnictví",
                ["Process3_Full"] = "Začneme aktivně vést vaše účetnictví. Nastavíme pravidelné procesy, online přístup k dokumentům a reportování. Provedeme vás celým systémem a zajistíme, že budete mít vše pod kontrolou.",
                ["Process4_Title"] = "Průběžná podpora",
                ["Process4_Brief"] = "Individuální přístup k každému klientovi",
                ["Process4_Full"] = "Poskytujeme kontinuální podporu, měsíční finanční reporty a jsme vám k dispozici pro konzultace kdykoliv. Proaktivně vás upozorňujeme na důležité termíny a optimalizujeme vaše finance."
            };
        }

        private async Task<bool> VerifyRecaptcha(string responseToken)
        {
            if (string.IsNullOrEmpty(responseToken))
                return false;

            var secretKey = _config["Recaptcha:SecretKey"];
            if (string.IsNullOrEmpty(secretKey))
            {
                // If no secret key is configured, skip verification (for development)
                return true;
            }

            try
            {
                using var client = new HttpClient();
                var response = await client.PostAsync(
                    $"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={responseToken}",
                    null);

                var jsonString = await response.Content.ReadAsStringAsync();
                dynamic jsonData = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(jsonString);
                
                return jsonData.GetProperty("success").GetBoolean();
            }
            catch
            {
                return false;
            }
        }
    }
}
