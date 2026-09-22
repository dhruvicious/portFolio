import type { Metadata } from "next";
import Link from "next/link";
import styles from "./privacy-policy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Dhruv Khatri Apps & Products",
  description: "General privacy policy for apps, websites, and digital products created by Dhruv Khatri.",
};

const updatedOn = "September 22, 2026";

const policySections = [
  {
    number: "01",
    title: "Scope of this policy",
    emphasis: "policy",
    paragraphs: [
      "This policy applies to apps, websites, games, and other digital products created by Dhruv Khatri when they link to this page from a product listing, settings screen, website, or other official location. Each covered product is designed around a simple principle: it does not collect your data.",
    ],
  },
  {
    number: "02",
    title: "No data is collected",
    emphasis: "data",
    paragraphs: [
      "Covered products do not collect personal information or usage data. This includes names, email addresses, phone numbers, contacts, photos, files, location, identifiers, device details, IP addresses, browsing activity, purchase history, or any other information that can identify you or describe how you use a product.",
    ],
  },
  {
    number: "03",
    title: "No tracking or analytics",
    emphasis: "tracking",
    paragraphs: [
      "Covered products do not use advertising SDKs, analytics services, crash-reporting tools, cookies, pixels, or telemetry. They do not track your activity across apps, websites, or services, and they do not create advertising profiles.",
    ],
  },
  {
    number: "04",
    title: "No sharing or selling",
    emphasis: "sharing",
    paragraphs: [
      "Because no data is collected, there is no personal information to share, sell, rent, disclose, or transfer to third parties. Covered products do not send user data to me, advertisers, data brokers, analytics providers, or any other outside party.",
    ],
  },
  {
    number: "05",
    title: "Permissions and local data",
    emphasis: "local data",
    paragraphs: [
      "Covered products do not request access to sensitive device permissions for data collection. If a product stores a preference or progress on your device, that information remains on your device and is not transmitted to me or to a third party. Uninstalling the product may remove locally stored data, depending on your device settings.",
    ],
  },
  {
    number: "06",
    title: "Children's privacy",
    emphasis: "privacy",
    paragraphs: [
      "Covered products do not knowingly collect personal information from anyone, including children. Since no personal information is collected, stored, or shared, there is no children's data to manage, disclose, or delete.",
    ],
  },
  {
    number: "07",
    title: "Third-party platforms",
    emphasis: "Third-party",
    paragraphs: [
      "A platform you use to download or purchase a product, such as Google Play, may process information under its own privacy policy. That processing is controlled by the platform and is separate from the product itself. This policy covers only data practices of the covered products created by Dhruv Khatri.",
    ],
  },
  {
    number: "08",
    title: "Policy updates",
    emphasis: "updates",
    paragraphs: [
      "If a covered product's data practices ever change, this policy will be updated before those changes take effect. The latest version will always be published on this page, with its revision date shown above.",
    ],
  },
];

function renderPolicyTitle(title: string, emphasis: string) {
  const [before, after] = title.split(emphasis);

  return <>{before}<em>{emphasis}</em>{after}</>;
}

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />

      <header className={styles.header}>
        <Link className={styles.backLink} href="/">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m14 6-6 6 6 6" />
          </svg>
          <span>Back to portfolio</span>
        </Link>
      </header>

      <section className={styles.hero} aria-labelledby="privacy-title">
        <div className={styles.titlePanel}>
          <p className={styles.titleSource}>Dhruv Khatri</p>
          <h1 id="privacy-title">
            <span className={styles.titleFirstLine}>Privacy Policy:</span>
            <span className={styles.titleSecondLine}>
              <span>No</span>
              <span className={styles.titleHighlight}>data</span>
              <span>collected.</span>
            </span>
          </h1>
        </div>
        <p className={styles.updated}>Last updated <time dateTime="2026-09-22">{updatedOn}</time></p>
      </section>

      <section className={styles.content} aria-label="Privacy policy details">


        <div className={styles.policyGrid}>
          {policySections.map((section) => (
              <article key={section.number} className={styles.policySection}>
                <div className={styles.policyTop}>
                  <span className={styles.policyNumber}>{section.number}</span>
                  <div className={styles.titleWrapper}>
                    <h2 className={styles.policyTitleOriginal}>
                      {renderPolicyTitle(section.title, section.emphasis)}
                    </h2>
                    <h2 className={styles.policyTitleHover} aria-hidden="true">
                      {renderPolicyTitle(section.title, section.emphasis)}
                    </h2>
                  </div>
                </div>
                <div className={styles.expandedArea}>
                  <div className={styles.expandedInner}>
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </div>
              </article>
          ))}
        </div>
      </section>

      <section className={styles.contactCard} aria-labelledby="privacy-contact-title">
        <div>
          <p className={styles.contactLabel}>Privacy questions</p>
          <h2 id="privacy-contact-title">Let&apos;s talk.</h2>
        </div>
        <a href="mailto:dhruvkhatri1234@gmail.com" className={styles.emailLink}>
          dhruvkhatri1234@gmail.com
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 19 19 5" />
            <path d="M9 5h10v10" />
          </svg>
        </a>
      </section>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Dhruv Khatri</span>
        <Link href="/">Portfolio home</Link>
      </footer>
    </main>
  );
}
