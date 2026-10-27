import type { ReactNode } from "react"
import styles from "./PageHeader.module.css"

/** The title block every page opens with. */
export function PageHeader({
  title,
  children,
}: {
  title: string
  /** One or two sentences under the title. */
  children?: ReactNode
}) {
  return (
    <header className={styles.header}>
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </header>
  )
}
