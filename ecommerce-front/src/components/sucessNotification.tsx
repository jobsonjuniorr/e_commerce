function SuccessNotification({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="z-40 fixed top-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
      <p>{message}</p>
      <button onClick={onClose} className="mt-2 underline text-white">Fechar</button>
    </div>
  );
}

export default SuccessNotification