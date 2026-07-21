# Daňový Dobrman

> Professional accounting & tax services website — [danovydobrman.cz](https://www.danovydobrman.cz/)

A modern, responsive landing page built for **Bc. Šárka Cimburková** — an accountant and tax advisor based in Plzeň, Czech Republic. The site was custom-built to the client's specifications, from the "Daňový Dobrman" (Tax Doberman) brand identity — named after her actual Doberman dog — to dynamic pricing cards and a contact form with file attachments.

---

## Live

**[🌐 danovydobrman.cz](https://www.danovydobrman.cz/)** — hosted on Active24

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core Razor Pages (.NET) |
| Frontend | Vanilla JS + jQuery + custom CSS |
| Validation | jQuery Validate + ASP.NET Unobtrusive Validation |
| Anti-spam | Google reCAPTCHA |
| Email | SMTP (System.Net.Mail) |
| Analytics | Google Analytics 4, Google Ads, Seznam Ads |
| Hosting | Apache reverse proxy → Kestrel (Active24, manual FTP deploy) |

---

## Features

- **🧠 SEO** — Schema.org `AccountingService` + `LocalBusiness`, Open Graph / Twitter Cards, canonical URL, `sitemap.xml`, geo meta tags for Plzeň
- **♿ Accessibility** — `aria-*` labels, semantic HTML, keyboard navigation, `prefers-contrast: high`, `prefers-reduced-motion`
- **🍪 GDPR cookie banner** — consent mode for Google Analytics
- **📱 Responsive** — hamburger menu, mobile quick-access grid, touch-friendly targets
- **💰 Dynamic pricing** — 5 service categories (sole traders, double-entry, payroll, tax returns, consulting) with JS-rendered pricing cards
- **🐾 Brand slideshow** — rotating Doberman photos synced with trait cards (loyalty, speed, precision, intelligence)
- **📎 File uploads** — contact form accepts up to 5 attachments (PDF/Word/Excel/images, 10 MB max each)
- **🌍 i18n-ready** — dictionary-based localization in C# (currently Czech only)
- **🔒 Security** — Anti-Forgery Tokens, file type & size validation, HTTPS in production
- **📊 Analytics & ads** — Google Analytics 4, Google Ads, Seznam Ads tracking

---

## Running Locally

```bash
git clone https://github.com/Topazen/danovy-dobrman.git
cd danovy-dobrman
dotnet run
```

Runs on `http://localhost:5000`.

---

## Project Structure

```
├── Pages/
│   ├── Index.cshtml              # Main landing page
│   ├── Index.cshtml.cs           # Page model (form handling, i18n, reCAPTCHA, email)
│   ├── Shared/_Layout.cshtml     # Layout (header, nav, footer, GDPR banner, GA, Schema.org)
│   └── Error.cshtml              # Error page
├── wwwroot/
│   ├── css/
│   │   ├── site.css              # Core styles (layout, hero, pricing, responsive)
│   │   ├── modern.css            # Design utilities (glass effects, cards, timeline, print)
│   │   ├── form.css              # Form styling
│   │   └── animations.css        # Animations (scroll-reveal, particle effects)
│   ├── js/
│   │   ├── app.js                # Navigation, slideshow, FAQ, toggles, parallax
│   │   ├── pricing-services.js   # Dynamic pricing cards by service category
│   │   ├── analytics.js          # Google Analytics helpers
│   │   └── animations.js         # Scroll-triggered reveal animations
│   ├── images/                   # Logo, Doberman photos, OG/Twitter cards
│   ├── robots.txt
│   └── sitemap.xml
├── Program.cs                    # Entry point (Kestrel, Razor Pages, Controllers)
├── UcetnictviSite.csproj         # .NET project file
├── appsettings.json              # Dev configuration
├── appsettings.Production.json   # Production configuration (SMTP, reCAPTCHA keys)
├── .htaccess                     # Apache → Kestrel reverse proxy
├── start.sh                      # Production launch script
└── upload-to-active24.ps1        # Deploy script for Active24 hosting
```

---

## About the Project

I built this site solo as a freelance project for a real client — Bc. Šárka Cimburková, an accountant and tax advisor from Plzeň. I also used it as a learning opportunity to get hands-on with **ASP.NET Core Razor Pages** and **jQuery**.

The "Daňový Dobrman" (Tax Doberman) branding was the client's idea — the Doberman is her actual dog, tying into the story of Karl Dobermann, a tax collector who originally bred the Doberman breed as a loyal guardian.

The whole site was built over **~2 months** during evenings and weekends — the client was also my boss at my day job, so time was limited. It's a **one-and-done project**: everything is automated and self-sustaining. The client will reach out if she ever needs changes.

---

## Production Configuration

Fill in `appsettings.Production.json` with real credentials:

```json
{
  "Recaptcha": {
    "SiteKey": "your-site-key",
    "SecretKey": "your-secret-key"
  },
  "Smtp": {
    "Host": "smtp.your-provider.com",
    "Port": 587,
    "EnableSsl": true,
    "User": "your-email",
    "Pass": "your-app-password",
    "From": "your-email",
    "To": "recipient-email"
  }
}
```

---

## License

MIT — feel free to use as a template or reference.

---

## Author

**Maksym Dumych (Topazen)**

- GitHub: [github.com/Topazen](https://github.com/Topazen)
- LinkedIn: [Maksym Dumych](https://www.linkedin.com/in/maksym-dumych/)

---

Built with ❤️ in Plzeň
