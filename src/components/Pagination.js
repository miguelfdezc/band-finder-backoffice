import React from 'react';

const Pagination = ({
  itemsPerPage,
  totalItems,
  paginate,
  currentPage,
  itemName,
}) => {
  const pageNumbers = [];
  const firstPage = 1;
  const lastPage = Math.ceil(totalItems / itemsPerPage);

  if (currentPage === lastPage && currentPage - 2 >= firstPage)
    pageNumbers.push(currentPage - 2);
  for (let i = firstPage; i <= lastPage; i++) {
    if (i === currentPage - 1 || i === currentPage || i === currentPage + 1)
      if (!pageNumbers.includes(i)) pageNumbers.push(i);
  }
  if (currentPage === firstPage && currentPage + 2 <= lastPage)
    pageNumbers.push(currentPage + 2);

  return (
    <nav>
      <ul className='pagination justify-content-center'>
        <li
          className={`page-item ${currentPage === firstPage ? 'disabled' : ''}`}
        >
          <a
            className='page-link'
            href={`${itemName}/${currentPage - 1}`}
            aria-label='Previous'
            onClick={(e) => {
              e.preventDefault();
              paginate(currentPage - 1);
            }}
          >
            <span aria-hidden='true'>&laquo;</span>
            <span className='sr-only'>Previous</span>
          </a>
        </li>
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${number === currentPage ? 'active' : ''}`}
          >
            <a
              className='page-link'
              href={`${itemName}/${number}`}
              onClick={(e) => {
                e.preventDefault();
                paginate(number);
              }}
            >
              {number}
            </a>
          </li>
        ))}
        <li
          className={`page-item ${currentPage === lastPage ? 'disabled' : ''}`}
        >
          <a
            className='page-link'
            href={`bands/${currentPage + 1}`}
            aria-label='Next'
            onClick={(e) => {
              e.preventDefault();
              paginate(currentPage + 1);
            }}
          >
            <span aria-hidden='true'>&raquo;</span>
            <span className='sr-only'>Next</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
