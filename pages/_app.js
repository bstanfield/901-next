// Top-level component useful for global styles + state
import { SWRConfig } from 'swr'
export default function App({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 1000
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  )
}