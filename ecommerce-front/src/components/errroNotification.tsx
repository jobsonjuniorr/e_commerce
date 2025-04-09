function ErrorNotification({ message }: { message: string; onClose: () => void }) {
    return (
      <div className="z-40 fixed mt-17 w-full flex flex-col items-end">
       <div className="fixed  bg-red-500 text-white p-2 px-4 py-2 md:w-1/4  rounded shadow-lg flex flex-col items-center">
       <p className="text-headline font-bold">{message}</p>
       </div>
      </div>
    );
  }
  
  export default ErrorNotification;
  