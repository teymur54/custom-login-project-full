import { useAuth } from '../context/AuthContext';
import '../styles/PostEmployee.css'
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; 
import { createEmployee, getAllDepartments, getAllPositions, getAllRanks } from '../api/axios';
import { toast } from 'react-hot-toast';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const PostEmployee = () => {
  const { jwtToken } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(['']);
  const [selectedRank, setSelectedRank] = useState(['']);
  const [selectedPosition, setSelectedPosition] = useState(['']);
  const [error, setError] = useState(null);

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

  const createEmployeeMutation = useMutation({
    mutationFn:(employeeData) => createEmployee(employeeData,jwtToken),
    onSuccess:() => {
      toast.success('istifadəçi uğurla əlavə olundu',{duration: 1000})
    },
    onError: (error) => {
      setError(error);
    },
  })

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setSelectedDepartment('');
    setSelectedRank('');
    setSelectedPosition('');
   };

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

    createEmployeeMutation.mutate(employeeData);

    resetForm();
    navigate('/')
  };

  return (
    <div className="create-employee-container">
      <form onSubmit={handleSubmit} className="create-employee-form">
        <label className="create-form-label">
          <span className="create-label-text">First name:</span>
          <input
            className="create-form-input"
            type="text"
            value={firstName}
            onChange={handleFirstNameChange}
            required
          />
        </label>
        <label className="create-form-label">
          <span className="create-label-text">Last name:</span>
          <input
            className="create-form-input"
            type="text"
            value={lastName}
            onChange={handleLastNameChange}
            required
          />
        </label>
        <label className="create-form-label">
          <span className="create-label-text">Department:</span>
          <Select
            className="create-form-select"
            value={departmentOptions?.find(dep => dep.value === selectedDepartment)}
            onChange={(e) => setSelectedDepartment(e.value)}
            options={departmentOptions}
            required
          />
        </label>
        <label className="create-form-label">
          <span className="label-text">Rank:</span>
          <Select
            className="create-form-select"
            value={rankOptions?.find((rank) => rank.value === selectedRank)}
            onChange={(e) => setSelectedRank(e.value)}
            options={rankOptions}
            required
          />
        </label>
        <label className="create-form-label">
          <span className="create-label-text">Position:</span>
          <Select
            className="create-form-select"
            value={positionOptions?.find((position) => position.value === selectedPosition)}
            onChange={(e) => setSelectedPosition(e.value)}
            options={positionOptions}
            required
          />
        </label>
        <br />
        <button className="create-submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  )
}

export default PostEmployee;