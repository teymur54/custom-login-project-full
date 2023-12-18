import React from 'react';
import { useState, useRef,useEffect,useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteEmployee, getAllEmployees } from '../api/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import '../styles/HomePage.css';
import { findEmployee } from '../api/axios';
import { getFilteredPaginatedEmployees } from '../api/axios';
import useDebounce from '../hooks/useDebounce';
import Header from './Header';

const HomePage = () => {
  const queryClient = useQueryClient();
  const { jwtToken } = useAuth();
  const componentPDF = useRef();
  const [showActions, setShowActions] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [sortBy,setSortBy] = useState('lastName'); 
  const [search,setSearch] = useState('');
  const debouncedSearch = useDebounce(search,500);
  const navigate = useNavigate();
  const inputRef = useRef();

  const { isSuccess, isLoading, isError, data: employees, error } = useQuery({
    queryKey:['employeesData', pageSize, pageNumber, sortBy, debouncedSearch],
    queryFn: () => {
      if (search?.trim() !== '') {
        return getFilteredPaginatedEmployees(jwtToken, search, pageSize, pageNumber, sortBy);
      } else {
        return getAllEmployees(jwtToken, pageSize, pageNumber, sortBy);
      }
    },
    enabled: !!jwtToken,
  });

  useEffect(() => {
    inputRef?.current?.focus()
  }, [isSuccess]);

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^\w\dƏəХхЪъЖжЮюБб]/g, "");
    setSearch(sanitizedValue);
  };

  const handlePreviousPage = () => {
    if (pageNumber > 0) {
      setPageNumber((prevPageNumber) => prevPageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (!employees.last) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };
  
  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(0);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPageNumber(0);
  };

  const deleteEmployeeMutation = useMutation({
    mutationFn: ({ id }) => deleteEmployee(id, jwtToken),
    onSuccess: () => {
      queryClient.invalidateQueries('employeesData');
    },
    onError: (error) => {
      if (error?.response?.status === 403)
        toast.error('Istifadəçini silməyə səlahiyyətiniz çatmır', {
          duration: 1000,
        });
    },
  });

  const handleUpdate = (employeeId) => {
    navigate(`/update/${employeeId}`);
  };

  const handleDelete = (employeeId) => {
    deleteEmployeeMutation.mutate({ id: employeeId });
  };

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: 'Userdata',
    onAfterPrint: () => {
      setShowActions(true);
    }
  });

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <>
    <Header
        search={search}
        handleSearchInputChange={handleSearchInputChange}
        setShowActions={setShowActions}
        generatePDF={generatePDF}
        employees={employees}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
        sortBy={sortBy}
        handleSortChange={handleSortChange}
      />
      {isLoading && <div>Loading...</div>}
      {!isLoading && <table ref={componentPDF} style={{ width: '100%',maxHeight: '60px', overflowY: 'scroll'}}>
        <thead>
          <tr>
            <th>Ad</th>
            <th>Soyad</th>
            <th>Rütbə</th>
            <th>Vəzifə</th>
            <th>Şöbə</th>
            {showActions && <th style={{width:'14%'}}>Əməliyyatlar</th>}
          </tr>
        </thead>
        <tbody>
        {employees && employees?.content?.length > 0 ? (
              employees?.content?.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.rank.name}</td>
                  <td>{employee.position.name}</td>
                  <td>{employee.department.name}</td>
                  {showActions && (
                    <td>
                      <div className="action-button-container">
                        <button
                          className="action-button update-button"
                          onClick={() => handleUpdate(employee.id)}
                        >
                          Yenilə
                        </button>
                        <button
                          className="action-button delete-button"
                          onClick={() => handleDelete(employee.id)}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No employees found.</td>
              </tr>
            )}
        </tbody>
      </table> }
    </>
  );
};

export default HomePage;
