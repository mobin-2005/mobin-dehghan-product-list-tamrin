
function Pagination({ currentPage, totalPages, setCurrentPage }) {
  if (totalPages === 0) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        onClick={() =>
          setCurrentPage((page) => Math.max(1, page - 1))
        }
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() =>
          setCurrentPage((page) => Math.min(totalPages, page + 1))
        }
        disabled={currentPage >= totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
