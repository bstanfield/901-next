// Top-level component useful for global styles + state
import '../styles/global.scss'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}