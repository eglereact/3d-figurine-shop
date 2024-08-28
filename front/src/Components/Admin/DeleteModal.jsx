import { useContext } from "react";
import { ModalsContext } from "../../Contexts/Modals";
import { FaTrashAlt } from "react-icons/fa";

export default function DeleteModal() {
  const { deleteModal, setDeleteModal } = useContext(ModalsContext);

  const submit = () => {
    deleteModal.doDelete(deleteModal.data);
    deleteModal.hideData(deleteModal.data);
    setDeleteModal(null);
  };

  if (deleteModal === null) {
    return null;
  }

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 ">
          <div className="bg-gray-100 p-10 rounded-lg m-4">
            <div className=" transform  rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white pt-14 rounded-lg">
                <div className="sm:flex sm:flex-col sm:justify-center sm:items-center gap-10">
                  <div className=" absolute mx-auto z-10 -top-10 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-20 sm:w-20">
                    <FaTrashAlt className="text-5xl text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left ">
                    <h3
                      className="text-base font-semibold leading-6 text-gray-900 text-center"
                      id="modal-title"
                    >
                      {deleteModal.data.title &&
                        `Delete product "${deleteModal.data.title}"`}
                      {deleteModal.data.name &&
                        `You are about to delete an account`}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 text-center p-4">
                        Are you sure you want to{" "}
                        <span className="uppercase text-red-600 font-bold">
                          delete{" "}
                          {deleteModal.data.title &&
                            `product "${deleteModal.data.title}"`}
                          {deleteModal.data.name &&
                            `${deleteModal.data.name}'s account `}
                        </span>
                        ? All of data will be permanently removed. This action
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={submit}
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteModal(null)}
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
