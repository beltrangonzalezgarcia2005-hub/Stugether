export default function Spinner({ size = 32 }) {
  return (
    <div style={{ display:'flex',justifyContent:'center',alignItems:'center',padding:40 }}>
      <div style={{
        width:size,height:size,border:'3px solid var(--blue-light)',
        borderTopColor:'var(--blue)',borderRadius:'50%',
        animation:'spin .8s linear infinite',
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
