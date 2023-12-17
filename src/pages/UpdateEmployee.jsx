import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; 
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllDepartments, getAllPositions, getAllRanks, updateEmployee, getEmployeeById } from '../api/axios';
import { toast } from 'react-hot-toast';
import Select from 'react-select';
import '../styles/UpdateEmployee.css'

const UpdateEmployee = () => {
  const { id } = useParams();
  const { jwtToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(['']);
  const [selectedRank, setSelectedRank] = useState(['']);
  const [selectedPosition, setSelectedPosition] = useState(['']);
  const [error, setError] = useState(null);

  const { data: employeeData } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployeeById(id, jwtToken),
    enabled: !!jwtToken,
  });

  useEffect(() => {
    if (employeeData) {
      setFirstName(employeeData.firstName || '');
      setLastName(employeeData.lastName || '');
      setSelectedDepartment(employeeData.department.id || '');
      setSelectedPosition(employeeData.position.id || '');
      setSelectedRank(employeeData.rank.id || '');
      // ...
    }
  }, [employeeData]);


  const {data: departments} = useQuery({
    queryKey:['departments'],
    queryFn: () => getAllDepartments(jwtToken),
    enabled: !!jwtToken,
  });

  const {data: positions} = useQuery({
    queryKey:['positions'],
    queryFn: () => getAllPositions(jwtToken),
    enabled: !!jwtToken,
  });

  const {data: ranks} = useQuery({
    queryKey:['ranks'],
    queryFn: () => getAllRanks(jwtToken),
    enabled: !!jwtToken,
  })

  const departmentOptions = departments?.map((department) => ({
    value: department.id,
    label: department.name,
  }));

  const positionOptions = positions?.map((position) => ({
    value: position.id,
    label: position.name,
  }));

  const rankOptions = ranks?.map((rank) => ({
    value: rank.id,
    label: rank.name,
  }));

  const updateEmployeeMutation = useMutation({
    mutationFn:(employeeData) => updateEmployee(id,employeeData,jwtToken),
    onSuccess:() => {
      queryClient.invalidateQueries('employeesData');
      toast.success('istifadəçi haqqında informasiya uğurla yeniləndi',{duration: 1000})
    },
    onError: (error) => {
      setError(error);
    },
  })

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const employeeData = {
      firstName,
      lastName,
      department: {
        id: selectedDepartment,
      },
      position: {
        id: selectedPosition,
      },
      rank: {
        id: selectedRank,
      },
    };

    updateEmployeeMutation.mutate(employeeData);

    navigate('/')
  };

  return (
    <div className="update-employee-container">
      <form onSubmit={handleSubmit} className="update-employee-form">
        <label className="update-form-label">
          <span className="update-label-text">First name:</span>
          <input
            className="update-form-input"
            type="text"
            value={firstName}
            onChange={handleFirstNameChange}
          />
        </label>
        <label className="update-form-label">
          <span className="update-label-text">Last name:</span>
          <input
            className="update-form-input"
            type="text"
            value={lastName}
            onChange={handleLastNameChange}
          />
        </label>
        <label className="update-form-label">
          <span className="update-label-text">Department:</span>
          <Select
            className="update-form-select"
            value={departmentOptions?.find(dep => dep.value === selectedDepartment)}
            onChange={(e) => setSelectedDepartment(e.value)}
            options={departmentOptions}
          />
        </label>
        <label className="update-form-label">
          <span className="update-label-text">Rank:</span>
          <Select
            className="update-form-select"
            value={rankOptions?.find((rank) => rank.value === selectedRank)}
            onChange={(e) => setSelectedRank(e.value)}
            options={rankOptions}
          />
        </label>
        <label className="update-form-label">
          <span className="update-label-text">Position:</span>
          <Select
            className="update-form-select"
            value={positionOptions?.find((position) => position.value === selectedPosition)}
            onChange={(e) => setSelectedPosition(e.value)}
            options={positionOptions}
          />
        </label>
        <br />
        <button className="update-submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  )
}

export default UpdateEmployee
