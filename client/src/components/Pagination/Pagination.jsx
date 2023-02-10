import React from "react";

export const Pagination = ({
  propertyPerPage,
  currentPage,
  setCurrentPage,
  totalProperty,
}) => {
  const pageNumber = [];

  for (let i = 1; i <= Math.ceil(totalProperty / propertyPerPage); i++) {
    pageNumber.push(i);
  }

  const onPreviusPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const onNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const onSpecificPage = (n) => {
    setCurrentPage(n);
  };

  return (
    <nav
      className="pagination is-centered mb-6"
      role="navigation"
      aria-label="pagination"
    >
      <button
        disabled={currentPage === 1 ? true : false}
        className={`pagination-previous ${
          currentPage === 1 ? "is-disabled" : ""
        }`}
        onClick={onPreviusPage}
      >
        Anterior
      </button>
      <button
        disabled={currentPage >= pageNumber.length ? true : false}
        className={`pagination-next ${
          currentPage >= pageNumber.length ? "is-disabled" : ""
        }`}
        onClick={onNextPage}
      >
        Siguiente
      </button>
      <ul className="pagination-list">
        {pageNumber.map((noPage) => (
          <li key={noPage}>
            <button
              className={`pagination-link ${
                noPage === currentPage ? "is-current" : ""
              }`}
              onClick={() => onSpecificPage(noPage)}
            >
              {noPage}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
