import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import Peer from 'peerjs';
import { useParams } from "react-router";
import $ from 'jquery';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MicNoneTwoToneIcon from '@material-ui/icons/MicNoneTwoTone';
import MicOffTwoToneIcon from '@material-ui/icons/MicOffTwoTone';
import VideocamTwoToneIcon from '@material-ui/icons/VideocamTwoTone';
import VideocamOffTwoToneIcon from '@material-ui/icons/VideocamOffTwoTone';
import ForumTwoToneIcon from '@material-ui/icons/ForumTwoTone';
import TextField from '@material-ui/core/TextField';
import SendTwoToneIcon from '@material-ui/icons/SendTwoTone';
import CloseIcon from '@material-ui/icons/Close';
import Badge from '@material-ui/core/Badge';
import './App.css';


const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        // flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        overflow: 'hidden',
        backgroundColor: "theme.palette.background.paper",
    },

    vid: {
        height: 50,
        width: 50
    },

    gridList: {
        width: 500,
        height: 450,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },

    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: "#ff796e"
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    },
    title: {
        flexGrow: 1,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
        marginLeft: 0
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
        marginLeft: 0
    },
}));


function App() {

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setCount(0);
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setCount(0);
        setOpen(false);
    };
    // let myVideoStream;


    const [roomId, setRoomId] = useState('');
    let { id, name } = useParams();
    const [mute, setMute] = useState(false);
    const [hide, setHide] = useState(false);
    const [vs, setVs] = useState('');
    const [msg, setMsg] = useState('');
    const [socket, setSocket] = useState(null);
    const [count, setCount] = useState(0);
    // const [socketConnected, setSocketConnected] = useState(false);

    useEffect(() => {
        setSocket(io('http://localhost:4000'));
        setRoomId(id);

    }, []);

    const addVideoStream = (video, stream) => {
        const videoGrid = document.getElementById('video-grid')
        // const videoName = document.getElementById('name')
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        videoGrid.append(video)
        // videoName.append(name)
    }

    const connectToNewUser = (myPeer, peers, userId, stream) => {
        if (userId != null) {
            // let name = "xyz"
            // console.log("connect " + userId);
            // console.log("new-user")

            const call = myPeer.call(userId, stream)
            const video = document.createElement('video')
            video.className = ('vid');
            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream)
            })
            call.on('close', () => {
                video.remove()
            })

            peers[userId] = call
        }

    }

    const handleMute = () => {
        let enabled = vs.getAudioTracks()[0].enabled;
        if (enabled) {
            vs.getAudioTracks()[0].enabled = false;
            setMute(false);
        } else {

            vs.getAudioTracks()[0].enabled = true;
            setMute(true);
        }

    }

    const handleHide = () => {
        let enabled = vs.getVideoTracks()[0].enabled;
        if (enabled) {
            vs.getVideoTracks()[0].enabled = false;
            setHide(false);
        } else {

            vs.getVideoTracks()[0].enabled = true;
            setHide(true);
        }

    }

    const onMsgChange = (e) => {
        e.preventDefault();
        setMsg(e.target.value);
    }

    const handleSend = (e) => {
        e.preventDefault();
        if (msg.length !== 0) {
            // console.log("handleSend");
            socket.emit('message', msg, name);
            setMsg('');
            $('#msgField').val('');
        }
    }

    const onKeyPressAction = (event) => {
        var code = event.keyCode || event.which;
        if ((code === 13) && (msg.length !== 0)) {
            socket.emit('message', msg, name);
            setMsg('');
            $('#msgField').val('');
        }
    }
    const scrollToBottom = () => {
        var d = $('.main__chat_window');
        d.scrollTop(d.prop("scrollHeight"));
    }

    useEffect(() => {

        if (!socket) return;
        // console.log("hi");
        socket.on('connect', () => {
            // console.log("connected");
            // setSocketConnected(socket.connected);

        });

        const myPeer = new Peer(undefined, {
            path: '/peerjs',
            host: '/',
            port: '443' //4000 on localhost 443 for heroku
        });

        let myVideoStream;
        let peers = {};

        const myVideo = document.createElement('video')
        myVideo.muted = true;

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            myVideoStream = stream;
            setVs(stream);
            addVideoStream(myVideo, stream)

            myPeer.on('call', call => {
                call.answer(stream)
                const video = document.createElement('video')
                call.on('stream', userVideoStream => {
                    addVideoStream(video, userVideoStream)
                })
            })


            socket.on('user-connected', (userId) => {
                if (userId != null)
                    connectToNewUser(myPeer, peers, userId, stream)
            })

            socket.on('user-disconnected', userId => {
                if (peers[userId]) peers[userId].close()
            })

        })



        myPeer.on('open', id => {
            // console.log("peerjs id" + id);
            socket.emit('join-room', roomId, id)

        })



        socket.on("createMessage", (message, sname) => {
            if (sname === name)
                $("ul").append(`<li class="rmessage"><span class="rspan"><b class="n">&nbsp;&nbsp;${sname}&nbsp;&nbsp;</b><br/>&nbsp;&nbsp;${message}&nbsp;&nbsp;</span></li>`);
            else {
                setCount(count + 1);
                $("ul").append(`<li class="lmessage"><span class="lspan"><b class="n">&nbsp;&nbsp;${sname}&nbsp;&nbsp;</b><br/>&nbsp;&nbsp;${message}&nbsp;&nbsp;</span></li>`);
            }
            scrollToBottom()
        })

        socket.on('disconnect', () => {
            // setSocketConnected(socket.connected);
        });


    }, [socket]);


    return (
        <>
            <div className={classes.root} style={{ backgroundColor: "gray" }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar>
                        <Typography variant="h6" noWrap className={classes.title} id="welcome" style={{ fontFamily: "raleway", textAlign: "left" }}> Hi {name}!</Typography>
                        <div>
                            <IconButton
                                color="inherit"
                                aria-label="mute"
                                edge="end"
                                style={{ padding: 20, marginRight: 0 }}
                                onClick={handleMute}
                            >
                                {!mute ? <MicOffTwoToneIcon fontSize="large" /> : <MicNoneTwoToneIcon fontSize="large" />}
                            </IconButton>

                            <IconButton
                                color="inherit"
                                aria-label="hide-vid"
                                edge="end"
                                style={{ padding: 20, marginLeft: 0 }}
                                onClick={handleHide}
                            >
                                {hide ? <VideocamOffTwoToneIcon fontSize="large" /> : <VideocamTwoToneIcon fontSize="large" />}
                            </IconButton>
                        </div>
                        <Typography variant="h6" noWrap className={classes.title} style={{ fontFamily: "raleway", textAlign: "center" }}>
                            Room Id: <span style={{ backgroundColor: "#ffd9d4", color: "#ff796e" }}>{roomId}</span>
                        </Typography>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="end"
                            onClick={handleDrawerOpen}
                            className={clsx(open && classes.hide)}
                        >
                            <Badge variant="dot" invisible={count ? false : true} color="error">
                                <ForumTwoToneIcon fontSize="large" />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >


                    <div className={classes.drawerHeader} />

                    <div className="main__videos">
                        <div id="video-grid">

                        </div>
                    </div>



                </main>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="right"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader} style={{ marginRight: 20 }}>
                        <IconButton onClick={handleDrawerClose}>
                            {/* {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />} */}
                            <CloseIcon fontSize="large" />
                        </IconButton>
                        <h3 style={{ color: "#ff796e", fontFamily: "relaway", marginTop: 8 }} > Chat </h3>
                    </div>
                    <Divider />

                    <div className="main__chat_window" style={{ padding: 0 }}>
                        <ul className="messages" id="ull" style={{ color: "black", padding: 20 }} />
                    </div>

                    <Divider />
                    <div className="main__message_container">
                        {/* <input id="chat_message" type="text" placeholder="Type message here..." /> */}

                        <TextField id="msgField" label="Your Message" color="secondary" onChange={onMsgChange} onKeyPress={onKeyPressAction} style={{ width: "80%" }} />

                        {msg ? <IconButton
                            type="submit"
                            onClick={handleSend}
                        ><SendTwoToneIcon /></IconButton> : <IconButton
                            type="submit"
                            onClick={handleSend}
                            disabled
                        >
                                <SendTwoToneIcon />

                            </IconButton>}



                    </div>

                </Drawer>
            </div >
        </>

    );
}

export default App;