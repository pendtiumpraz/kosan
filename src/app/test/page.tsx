// Simple test page - bypasses all complex components
export default function TestPage() {
    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
            <h1>KosanHub Test Page</h1>
            <p>If you see this, basic routing works!</p>
            <p>Time: {new Date().toISOString()}</p>
        </div>
    );
}
