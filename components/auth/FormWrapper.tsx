"use client";
import { BackButton } from "./BackButton";
import { Social } from "./Social";
import styles from "./FormWrapper.module.css";

type CardWrapperProps = {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
};

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <div className={styles.cardWrapper}>
      <div
        className={`${styles.content} sm:${styles.contentSm}`}
      >
        <h1 className={styles.header}>{headerLabel}</h1>
        <div>{children}</div>

        {showSocial && (
          <>
            <div className={styles.socialWrapper}>
              <div className={styles.divider}></div>
              <span className={styles.orText}>
                or continue with
              </span>
              <div className={styles.divider}></div>
            </div>
            <div className={styles.socialContainer}>
              <Social />
            </div>
          </>
        )}
      </div>

      <div
        className={`${styles.footer} sm:${styles.footerSm}`}
      >
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}
        />
      </div>
    </div>
  );
};
