import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout({ children, title }) {
  return (
    <div className="flex h-screen bg-navy overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 ml-16 lg:ml-52">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
