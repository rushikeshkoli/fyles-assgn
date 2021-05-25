import React, { ChangeEvent, useEffect, useState } from 'react';
import './App.css';
import { ArrowBackIos, ArrowForwardIos, Star, StarBorderOutlined, ExpandMore as ExpandMoreIcon } from '@material-ui/icons'
import { AppBar, Toolbar, Accordion, AccordionSummary, AccordionDetails, Typography, Paper, TablePagination, Button, Container, Select, MenuItem, FormControl, InputLabel, TextField, OutlinedInput, TableContainer, TableBody, Table, TableHead, TableCell, TableRow, SvgIcon, ButtonBase } from '@material-ui/core'
import axios from 'axios';
import BranchGrid from './Components/BranchGrid'

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

const CACHE: any = {}

const headCells: any[] = [
  { id: 1, numeric: true, disablePadding: true, label: "Bank Id" },
  { id: 2, numeric: false, disablePadding: true, label: "Branch" },
  { id: 3, numeric: false, disablePadding: false, label: "Address" },
  { id: 4, numeric: false, disablePadding: true, label: "City" },
  { id: 5, numeric: false, disablePadding: false, label: "District" },
  { id: 6, numeric: false, disablePadding: false, label: "State" }
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightBold,
    },
  }),
);

function App() {
  const classes = useStyles();

  const [city, setCity] = useState<string>('banglore');
  const [branchName, setBranchName] = useState<any>()
  const [branches, setBranches] = useState<any[]>()
  const [pageSize, setPageSize] = useState<number>(5)
  const [offset, setOffset] = useState<number>(0)
  const [myFavourites, setMyFavourites] = useState<any[]>()


  const handleBranchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOffset(0)
    setBranchName(e.target.value)
  }

  const handlePageChange = (e: ChangeEvent<{ value: unknown }>) => {
    setPageSize(parseInt(e.target.value as string))
    setOffset(0)
  }

  const handleCityChange = (e: ChangeEvent<{ value: unknown }>) => {
    setOffset(0)
    if (e.target.value) {
      console.log(e.target.value)
      setCity(e.target.value as string)
    }
  }

  async function fetchCityBranches() {
    const cacheId = `http://${process.env.REACT_APP_BACKEND_URL}/api/branches?q=${city}&limit=${pageSize}&offset=${offset}`
    if (CACHE[cacheId]) {
      setBranches(CACHE[cacheId])
    }
    const res = await axios.get(cacheId)
    const data = res.data
    CACHE[cacheId] = data.branches
    setBranches(data.branches)
    console.log(res.data)
  }

  async function fetchBranches() {
    const cacheId = `http://${process.env.REACT_APP_BACKEND_URL}/api/branches/autocomplete?q=${branchName}&limit=${pageSize}&offset=${offset}`
    if (CACHE[cacheId]) {
      setBranches(CACHE[cacheId])
    }
    const res = await axios.get(cacheId)
    const data = res.data
    CACHE[cacheId] = data.branches
    setBranches(data.branches)
    console.log(data)
  }

  const handleNewPageChange = (isPrev: boolean) => {
    console.log('page chage')
    if (isPrev) {
      if (offset != 0) {
        setOffset((oldVal) => oldVal - pageSize)
      }
    } else {
      if (branches && pageSize === branches.length) {
        console.log('ggg')
        setOffset((oldVal) => oldVal + pageSize)
      }
    }
  }

  const handleFavouriteClick = (favBranch: any) => {
    console.log('FAV ' + favBranch.ifsc)
    if (myFavourites) {
      if (myFavourites.some((val: any) => val.ifsc === favBranch.ifsc)) {
        setMyFavourites((fav: any) => fav.filter((temp: any) => temp.ifsc !== favBranch.ifsc))
      } else {
        setMyFavourites((fav: any) => [...fav, favBranch])
      }

    } else {
      setMyFavourites([favBranch])
    }
    // localStorage.setItem('fav', JSON.stringify(myFavourites))
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

  useEffect(() => {
    if (branchName) {
      fetchBranches()
    } else {
      fetchCityBranches()
    }
  }, [pageSize, offset])

  useEffect(() => {
    localStorage.setItem('fav', JSON.stringify(myFavourites))
  }, [myFavourites])

  useEffect(() => {
    const localFav = localStorage.getItem('fav')
    console.log(localFav)
    if (localFav !== 'undefined' && localFav) {
      // alert('a')
      setMyFavourites(JSON.parse(localFav))
    }
  }, [])

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
      <Paper>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Favourites</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <BranchGrid headCells={headCells} branches={myFavourites} myFavourites={myFavourites} handleFavouriteClick={handleFavouriteClick} isFav={true} />

          </AccordionDetails>
        </Accordion>
        <BranchGrid headCells={headCells} branches={branches} myFavourites={myFavourites} handleFavouriteClick={handleFavouriteClick} isFav={false} />
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={50}
          rowsPerPage={5}
          page={0}
          onChangePage={handleNewPageChange}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        /> */}
      </Paper>
      <div className="flex justify-center">
        {/* <TableCell> */}
        {/* <div className='m-5'> */}
        <TableRow>
          <TableCell>
            <ButtonBase onClick={() => handleNewPageChange(true)}>
              <ArrowBackIos />
            </ButtonBase>
          </TableCell>
          <TableCell>
            <InputLabel>Rows per page:</InputLabel>
            <Select onChange={handlePageChange} value={pageSize}>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </TableCell>

          <TableCell>

            <ButtonBase onClick={() => handleNewPageChange(false)}>
              <ArrowForwardIos />
            </ButtonBase>
          </TableCell>
        </TableRow>
        {/* <TextField label="page size" id="outlined-basic" placeholder="Page Size" onChange={handlePageChange} value={pageSize} type={'number'} /> */}
        {/* </div> */}
        {/* </TableCell> */}
      </div>
    </div >
  );
}

export default App;
