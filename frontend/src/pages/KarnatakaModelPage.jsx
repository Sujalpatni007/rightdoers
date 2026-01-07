/**
 * Andhra Pradesh Circular Economy Dashboard
 * Replaces the Karnataka Model page with the AP Dashboard
 * Loads the full HTML dashboard in an iframe for complete functionality
 */

export default function KarnatakaModelPage() {
  return (
    <div className="w-full h-screen bg-gray-100">
      <iframe
        src="/ap-dashboard.html"
        title="AP Circular Economy Dashboard"
        className="w-full h-full border-0"
        style={{ minHeight: '100vh' }}
      />
    </div>
  );
}
