import React, { ChangeEvent, useEffect, useState } from 'react';
import './App.css';
import { AppBar, Toolbar, Typography, Button, Container, Select, MenuItem, FormControl, InputLabel, TextField, OutlinedInput, TableContainer, TableBody, Table, TableHead, TableCell, TableRow } from '@material-ui/core'
import axios from 'axios';
import { Label } from '@material-ui/icons';

const headCells: any[] = [
  { id: 1, numeric: true, disablePadding: true, label: "Bank Id" },
  { id: 2, numeric: false, disablePadding: true, label: "Branch" },
  { id: 3, numeric: false, disablePadding: false, label: "Address" },
  { id: 4, numeric: false, disablePadding: true, label: "City" },
  { id: 5, numeric: false, disablePadding: false, label: "District" },
  { id: 6, numeric: false, disablePadding: false, label: "State" }
];

function App() {
  const [city, setCity] = useState<string>('banglore');
  const [branchName, setBranchName] = useState<any>()
  const [branches, setBranches] = useState<any[]>()
  const [pageSize, setPageSize] = useState<number>(5)
  const [offset, setOffset] = useState<number>(0)

  const handleBranchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOffset(0)
    setBranchName(e.target.value)
  }

  const handlePageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(e.target.value))
  }

  const handleCityChange = (e: ChangeEvent<{ value: unknown }>) => {
    setOffset(0)
    if (e.target.value) {
      console.log(e.target.value)
      setCity(e.target.value as string)
    }
  }

  async function fetchCityBranches() {
    const res = await axios.get(`http://localhost:8000/api/branches?q=${city}&limit=${pageSize}&offset=${0}`)
    const data = res.data
    setBranches(data.branches)
    console.log(res.data)
  }

  async function fetchBranches() {
    const res = await axios.get(`http://localhost:8000/api/branches/autocomplete?q=${branchName}&limit=${pageSize}&offset=${0}`)
    const data = res.data
    setBranches(data.branches)
    console.log(data)
  }

  useEffect(() => {
    console.log('fetching autocomplete')
    console.log(branchName)
    if (branchName) {
      fetchBranches()
    } else {
      fetchCityBranches()
    }
  }, [branchName])

  useEffect(() => {
    console.log('fetch using city')
    fetchCityBranches()
  }, [city])

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Bank Branches
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <div className="flex justify-between">
          <Select value={city} onChange={handleCityChange}>
            <MenuItem value="mumbai">Mumbai</MenuItem>
            <MenuItem value="delhi">Delhi</MenuItem>
            <MenuItem value="banglore">Banglore</MenuItem>
            <MenuItem value="kolkata">Kolkata</MenuItem>
            <MenuItem value="chennai">Chennai</MenuItem>
          </Select>
          <OutlinedInput id="outlined-basic" placeholder="Search Branch" onChange={handleBranchChange} value={branchName} />
        </div>
      </Container>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {branches?.map((branch: any) => (
              <TableRow>
                <TableCell>
                  {branch.bank_id}
                </TableCell>
                <TableCell>
                  {branch.branch}
                </TableCell>
                <TableCell>
                  {branch.address.substr(0, 10)}
                </TableCell>
                <TableCell>
                  {branch.city}
                </TableCell>
                <TableCell>
                  {branch.district}
                </TableCell>
                <TableCell>
                  {branch.state}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-center">
        <Button>Load More</Button>
        <div className='m-5'>
          <TextField label="page size" id="outlined-basic" placeholder="Page Size" onChange={handlePageChange} value={pageSize} type={'number'} />
        </div>
      </div>
    </div>
  );
}

export default App;
