import React from 'react';

const Header = ({
  search,
  handleSearchInputChange,
  setShowActions,
  generatePDF,
  employees,
  handlePreviousPage,
  handleNextPage,
  pageSize,
  handlePageSizeChange,
  sortBy,
  handleSortChange,
}) => {
  return (
    <div className="header">
      <input
        type="text"
        value={search}
        placeholder="search"
        onChange={handleSearchInputChange}
      />
      <button className="pdf-button" onClick={() => {
        setShowActions(false);
        setTimeout(() => {
          generatePDF();
        }, 100);
      }}>
        PDF
      </button>

      <button disabled={employees?.first} onClick={handlePreviousPage}>
        Previous
      </button>
      <select value={pageSize} onChange={handlePageSizeChange}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>
      <button disabled={employees?.last} onClick={handleNextPage}>
        Next
      </button>

      <select value={sortBy} onChange={handleSortChange}>
        <option value="firstName">First Name</option>
        <option value="lastName">Last Name</option>
      </select>
    </div>
  );
};

export default Header;