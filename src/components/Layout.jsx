import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import '../styles/Layout.css'

const Layout = () => {
  return (
    <div className='layout-container'>
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
