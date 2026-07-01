import Image from "next/image";
import styles from "./ticker.module.css";

export function ScrollingTicker() {
  return (
    <div className={styles.container} suppressHydrationWarning>
      <div className={styles.track}>
        <Image
          src="/ScrollingName.svg"
          alt="Scrolling Name"
          width={8372}
          height={652}
          className={styles.image}
          priority
        />
        <Image
          src="/ScrollingName.svg"
          alt=""
          width={8372}
          height={652}
          className={styles.image}
          priority
          aria-hidden="true"
        />
        <Image
          src="/ScrollingName.svg"
          alt=""
          width={8372}
          height={652}
          className={styles.image}
          priority
          aria-hidden="true"
        />
        <Image
          src="/ScrollingName.svg"
          alt=""
          width={8372}
          height={652}
          className={styles.image}
          priority
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
