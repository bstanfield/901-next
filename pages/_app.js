// Top-level component useful for global styles + state
import '../styles/global.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}