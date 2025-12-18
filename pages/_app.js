// Top-level component useful for global styles + state
import '../styles/global.scss'
import 'react-tippy/dist/tippy.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}

// Optimize web vitals reporting
export function reportWebVitals(metric) {
  // Optionally log metrics for debugging during development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric)
  }
}