// Top-level component useful for global styles + state
import '../styles/global.scss'
import 'react-tippy/dist/tippy.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}