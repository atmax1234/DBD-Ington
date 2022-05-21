const express = require("express");
const url = require("url");
const path = require("path");
const Discord = require("discord.js");
const ejs = require("ejs");
const passport = require("passport");
const bodyParser = require("body-parser");
const Strategy = require("passport-discord").Strategy;
require('dotenv').config();
const Settings = require("./settings.json");
const flash = require('express-flash')

module.exports = client => {
    //WEBSITE CONFIG BACKEND
    const app = express();
    const session = require("express-session");
    const MemoryStore = require("memorystore")(session);
    
    //initialize the discord login
    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((obj, done) => done(null, obj))
    passport.use(new Strategy({
        clientID: Settings.config.clientID,
        clientSecret: process.env.secret || Settings.config.secret,
        callbackURL: Settings.config.callback,
        scope: ["bot", "applications.commands"]
    },
    (accessToken, refreshToken, profile, done) => {
        process.nextTick(()=>done(null, profile))
    }
    ))

    app.use(session({
        store: new MemoryStore({checkPeriod: 86400000}),
        secret: `b($oyDJ>fs|0)xb':]>*9ycbqr[LR]_@&+Ug_5X~L_bH)?X$oM7do{soI%?-DSn`,
        resave: false,
        saveUninitialized: false
    }))
    app.use(flash());
    //Middlewares
    app.use(passport.initialize());
    app.use(passport.session());

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "./views"));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }))
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }))
    //Load CSS Files
    app.use(express.static(path.join(__dirname, "./public")));

    const checkAuth = (req, res, next) => {
        if(req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
    }
    app.get("/login", (req, res, next) => {
        if(req.session.backURL){
            req.session.backURL = req.session.backURL
        } else if(req.headers.referer){
            const parsed = url.parse(req.headers.referer);
            if(parsed.hostname == app.locals.domain){
                req.session.backURL = parsed.path
            }
        } else {
            req.session.backURL = "/"
        }
        next();
        }, passport.authenticate("discord", { prompt: "none"})
    );

    app.get("/callback", passport.authenticate("discord", { failureRedirect: "/" }), async (req, res) => {
        let banned = false //Ako imame banlist v mongodb
        if(banned) {
            req.session.destroy()
            res.json({login: false, message: "You are banned from the dashboard", logout: true})
            req.logout();
        } else {
            res.redirect("/dashboard")
        }
    });

    app.get("/logout", function(req, res) {
        req.logout(() => {
            req.user
        });
        res.redirect('/')
    });

    app.get("/", (req, res) => {
        res.render("app", {
            req: req,
            user: req.isAuthenticated ? req.user : null,
            bot: client,
            Permissions: Discord.Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
        })
    })

    app.get("/dashboard", (req, res) => {
        if(!req.isAuthenticated() || !req.user)
        return res.redirect("/?error=" + encodeURIComponent("Login First Please!"))
        if(!req.user.guilds)
        return res.redirect("/?error=" + encodeURIComponent("Fetching Guilds Failed!"))
        res.render("dashboard", {
            req: req,
            user: req.isAuthenticated ? req.user : null,
            bot: client,
            Permissions: Discord.Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
        })
    })

    app.get("/dashboard/:guildID", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID)
        if(!guild)
        return res.redirect("/?error=" + encodeURIComponent("It seems you didn't invite me in this guild yet!"))
        let member = guild.members.cache.get(req.user.id);
        if(!member) {
            try{
                member = await guild.members.fetch(req.user.id);
            } catch{

            }
        }
        if(!member)
        return res.redirect("/?error=" + encodeURIComponent("Login first please! / Join the Guild again!"))
        if(!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
        return res.redirect("/?error=" + encodeURIComponent("You are not allowed to do that"))

        res.render("settings", {
            req: req,
            user: req.isAuthenticated ? req.user : null,
            guild: guild,
            bot: client,
            Permissions: Discord.Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
        })
    })

    app.post("/dashboard/:guildID", checkAuth, async (req, res) => {
        const guild = client.guilds.cache.get(req.params.guildID)
        if(!guild)
        return res.redirect("/?error=" + encodeURIComponent("It seems you didn't invite me in this guild yet!"))
        let member = guild.members.cache.get(req.user.id);
        if(!member) {
            try{
                member = await guild.members.fetch(req.user.id);
            } catch{

            }
        }
        if(!member)
        return res.redirect("/?error=" + encodeURIComponent("Login first please! / Join the Guild again!"))
        if(!member.permissions.has(Discord.Permissions.FLAGS.MANAGE_GUILD))
        return res.redirect("/?error=" + encodeURIComponent("You are not allowed to do that"))

        res.render("settings", {
            req: req,
            user: req.isAuthenticated() ? req.user : null,
            guild: guild,
            bot: client,
            Permissions: Discord.Permissions,
            botconfig: Settings.website,
            callback: Settings.config.callback,
        })
    })

    const http = require("http").createServer(app)
    http.listen(Settings.config.port, () =>{
        console.log(`Our website is online! Port: ${Settings.config.port}`)
    })

}