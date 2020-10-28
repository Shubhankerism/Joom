import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import axios from 'axios';
import { useHistory } from 'react-router-dom'

import { useParams } from "react-router";
import $ from 'jquery';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import LaunchOutlinedIcon from '@material-ui/icons/LaunchOutlined';
import VideoCallOutlinedIcon from '@material-ui/icons/VideoCallOutlined';
import Fade from '@material-ui/core/Fade';
import FavoriteIcon from '@material-ui/icons/Favorite';
import BgImg from './bg.png';
import './App.css';

const useStyles = makeStyles({
  root: {
    backgroundColor: "#ffffff",

    textAlign: "center",
    // paddingBottom: 20,
    position: "fixed",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    display: "block",
    flexWrap: "wrap"
  },
  cardbg: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "#ff796e",
    boxShadow: "5px 5px 10px #ff796e",
    // background: 'linear-gradient(to bottom left, #ffffff 43%, #ce6479 100%)'
    padding: 20,
    marginTop: -20

  },
  bgImg: {
    backgroundImage: 'url(' + BgImg + ')',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginTop: 60,
    padding: 50,
  },
  h: {
    // height: 100
  }
});


function App() {
  const classes = useStyles();

  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [dt, setDt] = useState('');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const history = useHistory()
  let params = useParams();
  const port = process.env.PORT || 4000;
  // establish socket connection
  useEffect(() => {
    // setSocket(io(`http://localhost:${port}`));
    // setSocket(io('ws://infinite-retreat-69006.herokuapp.com'));
    setSocket(io('ws://jooom.herokuapp.com'));

    $('#joinId').val(params.id);
    setId(params.id);
    // console.log(params);

  }, []);

  // subscribe to the socket event
  useEffect(() => {

    if (!socket) return;
    // console.log("hi");
    socket.on('connect', () => {
      // console.log("connected");
      setSocketConnected(socket.connected);
      subscribeToDateEvent();
      test();
    });

    socket.on("getDate", data => {
      setDt(data);
    });


    socket.on('disconnect', () => {
      setSocketConnected(socket.connected);
    });


  }, [socket]);



  // manage socket connection
  // const handleSocketConnection = () => {
  //   if (socketConnected)
  //     socket.disconnect();
  //   else {
  //     socket.connect();
  //   }
  // }


  const test = () => {
    // console.log("test");
    socket.emit('test', 1000);
  }
  // subscribe to socket date event
  const subscribeToDateEvent = (interval = 1000) => {
    socket.emit('subscribeToDateEvent', interval);
  }
  const handleClick = () => {
    // axios.get(`http://localhost:4000/`)
    //   .then(res => {
    //     // console.log(res);
    //     setId(res.data.id);

    //   }).then(() => {
    //     // setTimeout(() => {
    //     history.push(`${id}/${name}`)
    //     // }, 3000);

    //   })
    let randomID = Math.floor(100000 + Math.random() * 900000);
    history.push(`${randomID}/${name}`);

  }

  const handleClickJoin = () => {

    history.push(`${id}/${name}`)

  }
  const onChange = (e) => {
    e.preventDefault();
    setId(e.target.value);
    // console.log(id);
  }

  const onChangeName = (e) => {
    e.preventDefault();
    setName(e.target.value);
    // console.log(name);
  }
  return (

    <div className={classes.root}>
      <CssBaseline />
      <br />
      {/* <br /> */}
      <Fade in={true} timeout={{ enter: 0 }}>
        <Grid container>

          <Grid

            md={6}
            container
            spacing={6}
            align="center"
            justify="center"
            direction="row"
            style={{ display: "flex" }}
          >


            <Grid item md={8}>
              {/* <br /> <br /><br /> */}
              <Typography variant="h2" component="h2" style={{ fontFamily: "raleway", color: "#ff796e", textShadow: "2px 2px gray" }}>
                Jooom
              </Typography>
              <Typography variant="h4" component="h4" style={{ fontFamily: "raleway", color: "gray" }}>
                ...video calling app
              </Typography>
            </Grid>
            {/* <br /> */}
            {/* <br /> */}
            <Grid item md={8}>

              <Card className={classes.cardbg}>
                {/* <CardActionArea> */}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2" style={{ fontFamily: "raleway", color: "gray" }} >

                    ENTER YOUR <span style={{ color: "#ff796e" }} >NAME</span>
                  </Typography>
                  <TextField id="standard-basic" label="Your Name" onChange={onChangeName} /> <br />
                  {/* <br /> */}
                  <hr />
                  <Typography gutterBottom variant="h5" component="h2" style={{ fontFamily: "raleway", color: "#ff796e" }} >

                    JOIN  <span style={{ color: "gray" }} > MEETING</span>
                  </Typography>

                  <form noValidate autoComplete="off">
                    <TextField id="joinId" label="Meeting Code" onChange={onChange} /> <br />
                    <br />
                    {/* <Link to={`/${id}/${name}`}> */}

                    <Button variant="outlined" onClick={handleClickJoin} disabled={(name && ($('#joinId').val())) ? false : true} color="secondary" startIcon={<VideoCallOutlinedIcon />}>
                      <span>
                        Join Meeting
                        </span>
                    </Button>
                    {/* </Link> */}
                  </form>
                  {/* </CardContent> */}
                  {/* </CardActionArea> */}
                  <hr />

                  {/* <CardActionArea> */}
                  {/* <CardContent> */}
                  <Typography gutterBottom variant="h5" component="h2" style={{ fontFamily: "raleway", color: "#ff796e" }} >

                    CREATE
                  <span style={{ color: "gray" }} > NEW MEETING</span>
                  </Typography>

                  <br />

                  <Button onClick={handleClick} variant="outlined" disabled={(name && !($('#joinId').val())) ? false : true} color="secondary" startIcon={<LaunchOutlinedIcon />}>
                    <span>
                      New Meeting
                    </span>
                  </Button>
                </CardContent>
                {/* </CardActionArea> */}
                {/* <br /> */}
              </Card>
              {/* </Fade> */}
            </Grid>


          </Grid>

          <Grid container md={6} className={classes.bgImg} id="mob">

          </Grid>
        </Grid>
      </Fade>
      <div style={{ marginTop: 20, alignContent: "center", fontFamily: "raleway", fontSize: "medium" }}> Made with <FavoriteIcon style={{ color: "red" }} /> by Shubhanker Srivastava</div>
    </div >
  );

}

export default App;