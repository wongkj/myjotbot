import React, { useState, useEffect } from 'react'
import {
    Typography,
    Container,
    makeStyles,
    withStyles,
    TextField,
    Paper,
    TableCell,
    TableRow,
    Grid,
    Button,
    Checkbox,
    FormGroup,
    FormControlLabel
} from '@material-ui/core'

import SearchComponent from '../components/SearchComponent'
import SearchIcon from '@material-ui/icons/Search';
import { RiUserSharedFill } from 'react-icons/ri';

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

const useStyles = makeStyles({
    containerStyle: {
        paddingTop: '2em',
        paddingLeft: '10em',
        paddingRight: '10em'
    },
    search: {
        width: "60%",
    },
    searchfield: {
        marginTop: "2em",
        marginBottom: "2em"
    },
    searchFieldIcon: {
        paddingTop: "15px",
        paddingRight: "10px"
    },
    userPaper: {
        padding: '10px',
        width: '100%',
        margin: "5px",
        background: "#ebfdff",
        display: "inline-block"
    },
    adminPaper: {
        padding: '10px',
        width: '100%',
        margin: "5px",
        background: "#fff6ff",
        display: "inline-block"
    },   
    plantPaper: {
        padding: '10px',
        width: '100%',
        margin: "5px",
        background: "#dffbdf",
        display: "inline-block"
    },     
    paperTitle: {
        flexGrow: 1
    },
    subTitle: {
        marginBottom: '10px'
    },
    buttons: {
        background: "#000000",
        color: "#fcfcfc",
        "&:hover": {
            color: "#000000"
        }
    },
    results: {
        marginTop: '2em'
    },
    info: {
        marginLeft: '2em',
        fontWeight: 'bold'
    }
})


const Search = () => {
    const classes = useStyles()

    const [filter, setFilter] = useState('')
    const [results, setResults] = useState([])

    const [state, setState] = React.useState({
        checkedUser: true,
        checkedPlant: false,
        checkedAdmin: false
      });

    // https://jv4185vu77.execute-api.us-east-1.amazonaws.com/dev/users
    useEffect(() => {
        fetch('https://s1vdqx3ir2.execute-api.us-east-1.amazonaws.com/dev/transcriptions')
        .then(res => res.json())
        .then(data => {
            let resultsArray = []
            let counter = 1;
            // setResults(data)
            data.map(dat => {
                let obj = {
                    id: counter,
                    key: dat.key,
                    value: dat.value,
                    lastModified: new Date(dat.lastModified)
                }
                counter++
                console.log(obj)
                resultsArray.push(obj)
            })
            setResults(resultsArray)
            console.log(resultsArray)
        })
    }, [])

    const handleSearchChange =e => {
        setFilter(e.target.value)
        console.log(filter)
    }

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
        console.log(state)
    };

    const getResult = (result) => {
        // console.log(result)
        const resultId = result.id - 1
        // console.log(value)
        const { id, key, value, lastModified } = results[resultId];
        if (results[resultId]) {
            return (
                <Paper
                className={classes.userPaper}
                variant="outlined"
                >
                    <Grid container>
                        <Grid item xs={3}>
                            <Typography
                                color="secondary"
                                className={classes.subTitle}
                            >
                                Transcription Filename
                            </Typography>                            
                            <Typography
                                className={classes.paperTitle}
                                variant="h7"
                                color="primary"
                            >
                            {key}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography
                                    color="secondary"
                                    className={classes.subTitle}
                                >
                                    Date Created
                            </Typography>
                            <Typography style={{color: '#276c82'}}>
                                {lastModified.toLocaleString('en-AU')}
                            </Typography>
                        </Grid>
                        <Grid item xs={7}>                            
                            <Typography
                                color="secondary"
                                className={classes.subTitle}
                            >
                                Content
                            </Typography>                                             
                            <Typography>
                                {value}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

            )
        }
    }

    return (
        <div className={classes.containerStyle}>
            <Typography
            variant="h4"
            >
                Search Page
            </Typography>

            {/* Search Functionality */}
            <div className={classes.searchfield}>
                <SearchIcon className={classes.searchFieldIcon}/>
                <TextField 
                onChange={handleSearchChange}
                className={classes.search}
                label="Search"
                variant="filled"
                placeholder="Search for plant, disease, user..."
                />
            </div>

            <div className={classes.info}>
                Type * to get <span style={{color: 'red'}}>ALL</span> transcriptions
            </div>
            {/* Results */}
            <div className={classes.results}>
            {
                results ? (
                    results.map(result => 
                    (
                        <div key={result.id}>
                            {
                                filter != '*' ? 
                                (
                                    results[result.id - 1].key.toUpperCase().includes(filter.toUpperCase()) || 
                                    results[result.id - 1].value.toUpperCase().includes(filter.toUpperCase()) ||
                                    results[result.id - 1].lastModified.toLocaleString('en-AU').toString().toUpperCase().includes(filter.toUpperCase())
                                )
                                && results[result.id - 1] && filter != '' &&
                                getResult(result)

                                : (
                                    getResult(result)
                                )
                            }
                        </div>
                ))
                ) : null
            }
            </div>                  
        </div>
    )
}

export default Search
