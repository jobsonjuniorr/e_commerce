function SuccessNotification({ message}: { message: string; onClose: () => void }) {
  return (
    <div className="z-40 fixed top-4 w-full flex flex-col items-end">
      <div className="bg-green-500 w-2/5 z-40 px-4 py-2  rounded  shadow-lg  ">
      <p className="text-headline font-bold">{message}</p>
      </div>
    </div>
  );
}

export default SuccessNotification