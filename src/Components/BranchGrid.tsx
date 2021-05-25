import React, { ChangeEvent, useEffect, useState } from 'react';
import { ArrowBackIos, ArrowForwardIos, Star, StarBorderOutlined, ExpandMore as ExpandMoreIcon } from '@material-ui/icons'
import { AppBar, Toolbar, Accordion, AccordionSummary, AccordionDetails, Typography, Paper, TablePagination, Button, Container, Select, MenuItem, FormControl, InputLabel, TextField, OutlinedInput, TableContainer, TableBody, Table, TableHead, TableCell, TableRow, SvgIcon, ButtonBase } from '@material-ui/core'


const BankGrid = ({ headCells, branches, myFavourites, handleFavouriteClick, isFav }: any) => {
  return (
    <TableContainer className="mt-8">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={'10'}>

              {/* <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        /> */}
            </TableCell>
            {headCells.map((headCell: any) => (
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
            <TableRow hover={true} key={branch.ifsc}>
              <TableCell>
                {/* hi */}
                {!isFav &&
                  <Button onClick={() => handleFavouriteClick(branch)}>
                    {myFavourites?.some((a: any) => a.ifsc === branch.ifsc) ?
                      <Star />
                      :
                      <StarBorderOutlined />
                    }
                  </Button>
                }
              </TableCell>
              <TableCell>
                {branch.bank_id}
              </TableCell>
              <TableCell>
                <ButtonBase onClick={() => { console.log('a') }}>
                  {branch.branch}
                </ButtonBase>
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
  )
}

export default BankGrid;