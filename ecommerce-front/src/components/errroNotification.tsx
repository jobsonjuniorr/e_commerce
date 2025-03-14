function ErrorNotification({ message, onClose }: { message: string; onClose: () => void }) {
    return (
      <div className="z-40 fixed top-4 bg-red-500 text-white px-4 py-2 md:w-1/4  rounded shadow-lg flex flex-col items-center">
        <p>{message}</p>
        <button onClick={onClose} className="mt-2 text-white">Fechar</button>
      </div>
    );
  }
  
  export default ErrorNotification;
  