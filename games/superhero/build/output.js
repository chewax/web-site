/// <reference path="../../lib/phaser.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Superhero;
(function (Superhero) {
    var Utils = (function () {
        function Utils() {
        }
        /**
         * Interpolates a value yn defined by coordinates (x1,y1) (x2,y2) and reference value xn
         * @param x1 X Coordinate of first point of the line
         * @param y1 Y Coordinate of first point of the line
         * @param x2 X Coordinate of second point of the line
         * @param y2 Y Coordinate of second point of the line
         * @param xn X Value of the Y value that is looked for
         * @returns {number}
         */
        Utils.intepolate = function (x1, y1, x2, y2, xn) {
            return ((xn - x1) * (y2 - y1) / (x2 - x1)) + y1;
        };
        /**
         *Returns an unorderd list between 0 and size
         *
         */
        Utils.semiRandomList = function (size) {
            var list = this.orderdList(size);
            return this.shuffleArray(list);
        };
        /**
        *Returns a list of a given length containing random integers within a given range
        *
        */
        Utils.randomList = function (game, listLength, rangeMin, rangeMax, allowDuplicates) {
            if (allowDuplicates === void 0) { allowDuplicates = false; }
            var list = [];
            //            while (list.length < listLength) {
            //                var newItem = game.rnd.integerInRange(rangeMin, rangeMax);
            //                if (newItem in list) {
            //                    if (allowDuplicates) {
            //                        list.push(newItem);
            //                    }
            //                    continue;
            //                }
            //                list.push(newItem);
            //            }
            return list;
        };
        /**
         * Randomize array element order in-place.
         * Using Fisher-Yates shuffle algorithm.
         */
        Utils.shuffleArray = function (array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        };
        /**
         * Returns an ordered list from 0 to size
         */
        Utils.orderdList = function (size) {
            return Array.apply(null, { length: size }).map(Number.call, Number);
        };
        Utils.groupConcat = function (group1, group2) {
            group1.children = group1.children.concat(group2.children);
            return group1;
        };
        Utils.interval = function (func, wait, times) {
            var interv = function (w, t) {
                return function () {
                    if (typeof t === "undefined" || t-- > 0) {
                        setTimeout(interv, w);
                        try {
                            func.call(null);
                        }
                        catch (e) {
                            t = 0;
                            throw e.toString();
                        }
                    }
                };
            }(wait, times);
            setTimeout(interv, wait);
        };
        return Utils;
    })();
    Superhero.Utils = Utils;
    var PieMask = (function (_super) {
        __extends(PieMask, _super);
        function PieMask(game, radius, x, y, rotation, sides) {
            if (radius === void 0) { radius = 50; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (rotation === void 0) { rotation = 0; }
            if (sides === void 0) { sides = 6; }
            _super.call(this, game, x / 2, y / 2);
            this.atRest = false;
            this.game = game;
            this.radius = radius;
            this.rotation = rotation;
            this.moveTo(this.x, this.y);
            if (sides < 3)
                this.sides = 3; // 3 sides minimum
            else
                this.sides = sides;
            this.game.add.existing(this);
        }
        PieMask.prototype.drawCircleAtSelf = function () {
            this.drawCircle(this.x, this.y, this.radius * 2);
        };
        PieMask.prototype.drawWithFill = function (pj, color, alpha) {
            if (color === void 0) { color = 0; }
            if (alpha === void 0) { alpha = 1; }
            this.clear();
            this.beginFill(color, alpha);
            this.draw(pj);
            this.endFill();
        };
        PieMask.prototype.lineToRadians = function (rads, radius) {
            this.lineTo(Math.cos(rads) * radius + this.x, Math.sin(rads) * radius + this.y);
        };
        PieMask.prototype.draw = function (pj) {
            // graphics should have its beginFill function already called by now
            this.moveTo(this.x, this.y);
            var radius = this.radius;
            // Increase the length of the radius to cover the whole target
            radius /= Math.cos(1 / this.sides * Math.PI);
            // Find how many sides we have to draw
            var sidesToDraw = Math.floor(pj * this.sides);
            for (var i = 0; i <= sidesToDraw; i++)
                this.lineToRadians((i / this.sides) * (Math.PI * 2) + this.rotation, radius);
            // Draw the last fractioned side
            if (pj * this.sides != sidesToDraw)
                this.lineToRadians(pj * (Math.PI * 2) + this.rotation, radius);
        };
        return PieMask;
    })(Phaser.Graphics);
    Superhero.PieMask = PieMask;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
var TextInfo;
(function (TextInfo) {
    (function (TextType) {
        TextType[TextType["PRAISE"] = 1] = "PRAISE";
        TextType[TextType["CRITICIZE"] = 2] = "CRITICIZE";
    })(TextInfo.TextType || (TextInfo.TextType = {}));
    var TextType = TextInfo.TextType;
    var InfoTextManager = (function () {
        function InfoTextManager(game) {
            this.xDirection = -1;
            this.game = game;
            this.goodJobText = [
                { text: "Nice!", level: 1 },
                { text: "Well Done!", level: 3 },
                { text: "Keep it up!", level: 4 },
                { text: "Good Job!", level: 6 },
                { text: "Perfect!", level: 9 },
                { text: "Awesome!", level: 12 },
                { text: "Sublime!", level: 15 },
                { text: "Oh yeah!", level: 18 },
                { text: "Superb!", level: 21 }
            ];
            this.badJobText = [
                { text: "Darn", level: 1 },
                { text: "Oh god!", level: 3 },
                { text: "Shall I keep looking?", level: 6 },
                { text: "Please don't", level: 9 },
                { text: "You better start practicing!", level: 12 },
                { text: "Dude!", level: 15 },
                { text: "Blimey!", level: 18 },
                { text: "Are you even paying attention?", level: 21 }
            ];
            this.comboText = [
                { text: "Bullseye", level: 1 },
                { text: "Marksman", level: 2 },
                { text: "Smoking", level: 3 },
                { text: "Multi blow", level: 4 },
                { text: "Super hit", level: 5 },
                { text: "Rampage!", level: 6 },
                { text: "Destruction Spree!", level: 7 },
                { text: "Unnstopable", level: 8 },
                { text: "Insane", level: 9 },
                { text: "Armageddon!", level: 10 },
                { text: "Godlike", level: 11 }
            ];
        }
        InfoTextManager.prototype.showGoodJobText = function () {
            var style = { font: "30px saranaigamebold", fill: "#FDCD08", align: "center" };
            // Set New Text
            var frase = this.goodJobText[this.game.rnd.integerInRange(0, this.goodJobText.length - 1)].text;
            var txt = this.game.add.text(this.game.world.centerX, this.game.world.centerY, frase, style);
            var newx = txt.x - this.xDirection * (200 * this.game.rnd.integerInRange(1, 2));
            var newy = txt.y - 100;
            var tween = this.game.add.tween(txt).to({ x: newx, y: newy }, 1000, Phaser.Easing.Default, true, 0, 0, false).onComplete.add(function () {
                txt.destroy();
            }, this);
            this.xDirection *= -1;
        };
        InfoTextManager.prototype.showBadJobText = function () {
            var style = { font: "30px saranaigamebold", fill: "#FF0000", align: "center" };
            // Set New Text
            var frase = this.badJobText[this.game.rnd.integerInRange(0, this.badJobText.length - 1)].text;
            var txt = this.game.add.text(this.game.world.centerX, this.game.world.centerY, frase, style);
            var newx = txt.x - this.xDirection * (200 * this.game.rnd.integerInRange(1, 2));
            var newy = txt.y - 100;
            var tween = this.game.add.tween(txt).to({ x: newx, y: newy }, 1000, Phaser.Easing.Default, true, 0, 0, false).onComplete.add(function () {
                txt.destroy();
            }, this);
            this.xDirection *= -1;
        };
        InfoTextManager.prototype.showComboText = function (level) {
            var style = { font: "30px saranaigamebold", fill: "#00FF00", align: "center" };
            var frase = "Combo Lost";
            var soundChoices = ['goodJob', 'congratulations', 'greatWork'];
            var sound = this.game.add.audio(soundChoices[this.game.rnd.integerInRange(0, 2)], 0.8, false);
            for (var i = this.comboText.length - 1; i >= 0; i--) {
                if (this.comboText[i].level < level) {
                    frase = this.comboText[i].text;
                    // It is inside this for to avoid playing congrat text upon loosing a level.
                    if (this.game.conf.ISMUSICENABLED)
                        sound.play();
                    break;
                }
            }
            var txt = this.game.add.text(this.game.world.centerX, this.game.world.centerY, frase, style);
            var newx = txt.x - this.xDirection * (200 * this.game.rnd.integerInRange(1, 2));
            var newy = txt.y - 100;
            var tween = this.game.add.tween(txt).to({ x: newx, y: newy }, 1000, Phaser.Easing.Default, true, 0, 0, false).onComplete.add(function () {
                txt.destroy();
            }, this);
            this.xDirection *= -1;
        };
        InfoTextManager.prototype.showCustomText = function (frase) {
            var style = { font: "30px saranaigamebold", fill: "#FDCD08", align: "center" };
            var txt = this.game.add.text(this.game.world.centerX, this.game.world.centerY, frase, style);
            var newx = txt.x - this.xDirection * (200 * this.game.rnd.integerInRange(1, 2));
            var newy = txt.y - 100;
            var tween = this.game.add.tween(txt).to({ x: newx, y: newy }, 1000, Phaser.Easing.Default, true, 0, 0, false).onComplete.add(function () {
                txt.destroy();
            }, this);
            this.xDirection *= -1;
        };
        InfoTextManager.prototype.showNewRecordText = function (frase) {
            if (frase === void 0) { frase = "NEW RECORD!"; }
            var style = { font: "50px saranaigamebold", fill: "#27E5E8", align: "center" };
            var txt = this.game.add.text(this.game.world.centerX, this.game.world.centerY, frase, style);
            var newx = txt.x - this.xDirection * (200 * this.game.rnd.integerInRange(1, 2));
            var newy = txt.y - 100;
            var tween = this.game.add.tween(txt).to({ x: newx, y: newy }, 1000, Phaser.Easing.Default, true, 0, 0, false).onComplete.add(function () {
                txt.destroy();
            }, this);
            this.xDirection *= -1;
        };
        return InfoTextManager;
    })();
    TextInfo.InfoTextManager = InfoTextManager;
})(TextInfo || (TextInfo = {}));
/**
 * UI Class
 * Wraps the logic to setup and handle the ui
 */
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Character.ts"/>
/// <reference path="../text/TextInfo.ts"/>
var Superhero;
(function (Superhero) {
    var UI = (function () {
        function UI(game, player) {
            this.shieldLastCount = 0;
            this.livesLastCount = 0;
            this.nukesLastCount = 0;
            this.warpLastCount = 0;
            this.rocketLastCount = 0;
            this.scoreCount = 0;
            this.brokeRecord = false;
            this.recordSaved = false;
            this.game = game;
            this.player = player;
            this.infoText = new TextInfo.InfoTextManager(this.game);
            if (this.game.state.current == "level1") {
                this.game.state.states.Level1.collectableManager.onCollect.removeAll();
                this.game.state.states.Level1.collectableManager.onCollect.add(this.dispatchPraiseText, this);
                this.game.state.states.Level1.hero.onHit.removeAll();
                this.game.state.states.Level1.hero.onHit.add(this.dispatchCriticizeText, this);
            }
            this.createTimer();
            this.createScoreBoard();
            this.createPlayerInterface();
            this.createPowerUpInterface();
        }
        UI.prototype.update = function () {
            this.updateShields();
            this.updateLives();
            this.updatePUPIcons();
            this.updateCooldowns();
            if (Math.floor(this.player.comboLevel) > 0) {
                this.comboText.setText("combo X" + Math.floor(this.player.comboLevel + 1));
            }
            else {
                this.comboText.setText("");
            }
            if (this.scoreCount > this.game.conf.TOPSCORE && !this.brokeRecord) {
                this.brokeRecord = true;
                this.infoText.showNewRecordText();
            }
            if (!this.player.sprite.alive)
                this.popUpMenu();
        };
        UI.prototype.popUpMenu = function () {
            if (this.player.sprite.alive)
                this.menu.reset(this.game.world.centerX, this.game.world.centerY);
            else
                this.menuDisabled.reset(this.game.world.centerX, this.game.world.centerY);
            this.game.world.bringToTop(this.menu);
            if (!this.recordSaved)
                this.game.conf.save();
            this.recordSaved = true;
            this.timer.pause();
            this.game.paused = true;
            this.game.sound.pauseAll();
            this.game.input.onDown.add(this.unPause, this);
        };
        UI.prototype.dispatchCriticizeText = function () {
            this.infoText.showBadJobText();
        };
        UI.prototype.dispatchPraiseText = function () {
            this.infoText.showGoodJobText();
        };
        UI.prototype.createTimer = function () {
            var puinfo = this.game.add.sprite(this.game.world.centerX + 60, 10, 'puinfo');
            puinfo.scale.setTo(-0.5, 0.5);
            puinfo.inputEnabled = true;
            puinfo.events.onInputDown.add(this.popUpMenu, this);
            this.pauseButton = this.game.add.sprite(this.game.world.centerX + 15, 25, 'pauseBtn');
            this.pauseButton.inputEnabled = true;
            this.pauseButton.scale.setTo(1.5, 1.5);
            this.menu = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'menuBack');
            this.menu.anchor.setTo(0.5, 0.5);
            this.menu.inputEnabled = true;
            this.menuDisabled = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'menuBackDisabled');
            this.menuDisabled.anchor.setTo(0.5, 0.5);
            this.menuDisabled.inputEnabled = true;
            this.menu.kill();
            this.menuDisabled.kill();
            this.timer = this.game.time.create(false);
            this.pauseButton.events.onInputDown.add(this.popUpMenu, this);
            var style = { font: "25px saranaigamebold", fill: "#FFFFFF", align: "center" };
            this.timerText = this.game.add.text(this.game.world.centerX - 60, 40, "0:00", style);
            this.timerText.anchor.set(0, 0.5);
            this.timer.loop(Phaser.Timer.SECOND, this.updateTime, this);
            this.timer.start();
        };
        UI.prototype.unPause = function (event) {
            // Calculate the corners of the menu;
            var menu = this.player.sprite.alive ? this.menu : this.menuDisabled;
            var x1 = this.game.world.centerX - menu.width / 2, x2 = this.game.world.centerX + menu.width / 2, y1 = this.game.world.centerY - menu.height / 2, y2 = this.game.world.centerY + menu.height / 2;
            this.game.sound.resumeAll();
            // Check if the click was inside the menu
            if (event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2) {
                // The choicemap is an array that will help us see which item was clicked
                // Get menu local coordinates for the click
                var x = event.x - x1, y = event.y - y1;
                // Calculate the choice
                var choice = Math.floor(((y / 4) - 28) / 22) + 1;
                switch (choice) {
                    case 1:
                        if (!this.player.sprite.alive)
                            return;
                        this.game.input.onDown.remove(this.unPause, this);
                        menu.kill();
                        this.timer.resume();
                        this.game.paused = false;
                        break;
                    case 2:
                        this.game.input.onDown.remove(this.unPause, this);
                        this.timer.resume();
                        this.game.paused = false;
                        this.game.state.restart(true, false);
                        break;
                    case 3:
                        this.game.input.onDown.remove(this.unPause, this);
                        this.timer.resume();
                        this.game.paused = false;
                        this.game.sound.stopAll();
                        this.game.state.start('Menu', true, false);
                        break;
                    default:
                        if (!this.player.sprite.alive)
                            return;
                        this.game.input.onDown.remove(this.unPause, this);
                        this.timer.resume();
                        this.game.paused = false;
                        // Remove the menu
                        menu.kill();
                        break;
                }
            }
            else {
                if (!this.player.sprite.alive)
                    return;
                // Remove the menu and the label
                menu.kill();
                // Doing it this way to avoid the menu to become invisibly operated
                this.game.input.onDown.remove(this.unPause, this);
                // Unpause the game
                this.game.paused = false;
                this.timer.resume();
            }
        };
        UI.prototype.createScoreBoard = function () {
            var style = { font: "30px saranaigamebold", fill: "#FDCD08", align: "center" };
            this.scoreText = this.game.add.text(20, 50, "", style);
        };
        UI.prototype.scoreUp = function (amount) {
            this.scoreCount += amount * Math.floor(this.player.comboLevel + 1);
            this.scoreText.setText(this.scoreCount.toString());
        };
        UI.prototype.updateCooldowns = function () {
            this.updateNukeCooldown();
            this.updateWarpCooldown();
        };
        UI.prototype.updateNukeCooldown = function () {
            var elapsed = this.game.time.elapsedSecondsSince(this.player.nukeCoolDown);
            var cooldown = 30;
            if (elapsed > cooldown) {
                if (!this.nukesIcon.mask.atRest)
                    this.nukesIcon.mask.drawCircleAtSelf();
                this.nukesIcon.mask.atRest = true;
                return;
            }
            var pj = elapsed / cooldown;
            this.nukesIcon.mask.drawWithFill(pj, 0xFFFFFF, 0.5);
            this.nukesIcon.mask.atRest = false;
        };
        UI.prototype.updateWarpCooldown = function () {
            var elapsed = this.game.time.elapsedSecondsSince(this.player.warpCoolDown);
            var cooldown = 30;
            if (elapsed > cooldown) {
                if (!this.warpIcon.mask.atRest)
                    this.warpIcon.mask.drawCircleAtSelf();
                this.warpIcon.mask.atRest = true;
                return;
            }
            var pj = elapsed / cooldown;
            this.warpIcon.mask.drawWithFill(pj, 0xFFFFFF, 0.5);
            this.warpIcon.mask.atRest = false;
        };
        UI.prototype.updateTime = function () {
            var minutes = Math.floor(this.timer.seconds / 60);
            var seconds = Math.floor(this.timer.seconds - (minutes * 60));
            this.timerText.setText(minutes.toString() + ":" + ("0" + seconds.toString()).slice(-2));
        };
        UI.prototype.updateShields = function () {
            if (this.shieldLastCount == this.player.shield)
                return;
            if (this.shieldLastCount > this.player.shield)
                this.killNextShield();
            else
                this.reviveNextShield();
            this.shieldLastCount = this.player.shield;
        };
        UI.prototype.updateLives = function () {
            this.livesText.setText('x' + this.player.lives.toString());
        };
        UI.prototype.updatePUPIcons = function () {
            this.updateNukes();
            this.updateRockets();
            this.updateWarps();
        };
        UI.prototype.updateNukes = function () {
            if (this.nukesLastCount == this.player.nukes)
                return;
            this.nukesText.setText(this.player.nukes.toString());
            if (this.player.nukes > 0) {
                this.nukesIcon.alpha = 1;
                this.nukesText.alpha = 1;
                this.game.gamepad.buttonPad.button2.sprite.alpha = 1;
            }
            else {
                this.nukesIcon.alpha = 0.3;
                this.nukesText.alpha = 0.3;
                this.game.gamepad.buttonPad.button2.sprite.alpha = 0.3;
            }
            this.nukesLastCount = this.player.nukes;
        };
        UI.prototype.updateRockets = function () {
            if (this.rocketLastCount == this.player.bombs)
                return;
            this.rocketText.setText(this.player.bombs.toString());
            if (this.player.bombs > 0) {
                this.rocketIcon.alpha = 1;
                this.rocketText.alpha = 1;
                this.game.gamepad.buttonPad.button4.sprite.alpha = 1;
            }
            else {
                this.rocketIcon.alpha = 0.3;
                this.rocketText.alpha = 0.3;
                this.game.gamepad.buttonPad.button4.sprite.alpha = 0.3;
            }
            this.rocketLastCount = this.player.bombs;
        };
        UI.prototype.updateWarps = function () {
            if (this.warpLastCount == this.player.timeWarps)
                return;
            this.warpText.setText(this.player.timeWarps.toString());
            if (this.player.timeWarps > 0) {
                this.warpIcon.alpha = 1;
                this.warpText.alpha = 1;
                this.game.gamepad.buttonPad.button3.sprite.alpha = 1;
            }
            else {
                this.warpIcon.alpha = 0.3;
                this.warpText.alpha = 0.3;
                this.game.gamepad.buttonPad.button3.sprite.alpha = 0.3;
            }
            this.warpLastCount = this.player.timeWarps;
        };
        /**
         * Renders n Shields starting on (x,y) and moving to the right of the screen
         * @param n Amounts of shields to render
         * @param x Starting x
         * @param y Starting y
         */
        UI.prototype.renderShieldIcons = function (n, x, y) {
            for (var i = 0; i < n; i++) {
                this.shieldIcons[i] = this.game.add.sprite(x, y, 'pups', 'shield_s');
                this.shieldIcons[i].anchor.setTo(0, 0.5);
                x = x + this.shieldIcons[i].width + 5;
                this.shieldLastCount += 1;
            }
        };
        /**
         * Revives n Shield icons starting from right to left
         * @param n
         */
        UI.prototype.reviveShieldIcon = function (n) {
            var revived = 0;
            for (var i = this.player.shield - 1; revived < n && i > -1; i--) {
                this.shieldIcons[i].revive();
                this.shieldLastCount -= 1;
                revived += 1;
            }
        };
        /**
         * Kills n shield icons, starting from the right.
         * @param n
         */
        UI.prototype.killShieldIcon = function (n) {
            var killed = 0;
            for (var i = this.shieldIcons.length - 1; killed < n && i > -1; i--) {
                this.shieldIcons[i].kill();
                this.shieldLastCount -= 1;
                killed += 1;
            }
        };
        UI.prototype.killNextShield = function () {
            for (var i = 0; i < this.shieldIcons.length; i++) {
                if (!this.shieldIcons[i].alive && i > 0) {
                    this.shieldIcons[i - 1].kill();
                    return;
                }
            }
            this.shieldIcons[this.shieldIcons.length - 1].kill();
        };
        UI.prototype.reviveNextShield = function () {
            for (var i = 0; i < this.shieldIcons.length; i++) {
                if (!this.shieldIcons[i].alive) {
                    this.shieldIcons[i].revive();
                    return;
                }
            }
        };
        UI.prototype.createPlayerInterface = function () {
            var x = 20;
            var y = 30;
            var style = { font: "20px saranaigamebold", fill: "#FDCD08", align: "center" };
            // LIVES
            this.livesIcon = this.game.add.sprite(x, y, 'pups', 'hero1_s');
            this.livesIcon.anchor.setTo(0, 0.5);
            x = x + this.livesIcon.width + 10;
            //this.livesText = this.game.add.text(x, y+5, 'x' + this.player.lives.toString(), style);
            this.livesText = this.game.add.text(x, y + 5, '', style);
            this.livesText.anchor.set(0, 0.5);
            this.livesLastCount = this.player.lives;
            x = x + this.livesText.width + 10;
            // SHIELDS
            this.shieldIcons = [];
            this.renderShieldIcons(3, x + 20, y);
            this.killShieldIcon(3);
            var style = { font: "40px saranaigamebold", fill: "#FDCD08", align: "center" };
            this.comboText = this.game.add.text(this.game.world.centerX, 100, "", style);
            this.comboText.anchor.set(0.5, 0.5);
        };
        UI.prototype.createPowerUpInterface = function () {
            var x = this.game.width - 50;
            var y = 15;
            var style = { font: "15px saranaigamebold", fill: "#FDCD08", align: "center" };
            // NUKES
            this.nukesIcon = this.game.add.sprite(x, y, 'pups', 'nuke_s');
            this.nukesText = this.game.add.text(x + (this.nukesIcon.width / 2) + 1, y + 33, this.player.nukes.toString(), style);
            this.nukesText.anchor.set(0.5, 0);
            this.nukesLastCount = this.player.nukes;
            // NUKE ICON MASK
            var mask_x = x + (this.nukesIcon.width / 2);
            var mask_y = y + (this.nukesIcon.height / 2);
            var mask_radius = Math.max(this.nukesIcon.width, this.nukesIcon.height) / 2;
            this.nukesIcon.mask = new Superhero.PieMask(this.game, mask_radius, mask_x, mask_y);
            if (this.player.nukes == 0) {
                this.nukesIcon.alpha = 0.3;
                this.nukesText.alpha = 0.3;
                this.game.gamepad.buttonPad.button2.sprite.alpha = 0.3;
            }
            x = x - (this.nukesIcon.width + 10);
            // WARPS
            this.warpIcon = this.game.add.sprite(x, y, 'pups', 'clock_s');
            this.warpText = this.game.add.text(x + (this.warpIcon.width / 2) + 1, y + 33, this.player.timeWarps.toString(), style);
            this.warpText.anchor.set(0.5, 0);
            this.warpLastCount = this.player.timeWarps;
            // WARP ICON MASK
            mask_x = x + (this.warpIcon.width / 2);
            mask_y = y + (this.warpIcon.height / 2);
            mask_radius = Math.max(this.warpIcon.width, this.warpIcon.height) / 2;
            this.warpIcon.mask = new Superhero.PieMask(this.game, mask_radius, mask_x, mask_y);
            if (this.player.timeWarps == 0) {
                this.warpIcon.alpha = 0.3;
                this.warpText.alpha = 0.3;
                this.game.gamepad.buttonPad.button3.sprite.alpha = 0.3;
            }
            x = x - (this.warpIcon.width + 10);
            // ROCKETS
            this.rocketIcon = this.game.add.sprite(x, y, 'pups', 'rocket_s');
            this.rocketText = this.game.add.text(x + (this.rocketIcon.width / 2) + 1, y + 33, this.player.bombs.toString(), style);
            this.rocketText.anchor.set(0.5, 0);
            this.rocketLastCount = this.player.bombs;
            if (this.player.bombs == 0) {
                this.rocketIcon.alpha = 0.3;
                this.rocketText.alpha = 0.3;
                this.game.gamepad.buttonPad.button4.sprite.alpha = 0.3;
            }
        };
        return UI;
    })();
    Superhero.UI = UI;
})(Superhero || (Superhero = {}));
/**
 * Phaser joystick plugin.
 * Usage: In your preloader function call the static method preloadAssets. It will handle the preload of the necessary
 * assets. Then in the Stage in which you want to use the joystick, in the create method, instantiate the class and add such
 * object to the Phaser plugin manager (eg: this.game.plugins.add( myPlugin ))
 * Use the cursor.up / cursor.down / cursor.left / cursor.right methods to check for inputs
 * Use the speed dictionary to retrieve the input speed (if you are going to use an analog joystick)
 */
/// <reference path="../../lib/phaser.d.ts"/>
var Gamepads;
(function (Gamepads) {
    (function (Sectors) {
        Sectors[Sectors["HALF_LEFT"] = 1] = "HALF_LEFT";
        Sectors[Sectors["HALF_TOP"] = 2] = "HALF_TOP";
        Sectors[Sectors["HALF_RIGHT"] = 3] = "HALF_RIGHT";
        Sectors[Sectors["HALF_BOTTOM"] = 4] = "HALF_BOTTOM";
        Sectors[Sectors["TOP_LEFT"] = 5] = "TOP_LEFT";
        Sectors[Sectors["TOP_RIGHT"] = 6] = "TOP_RIGHT";
        Sectors[Sectors["BOTTOM_RIGHT"] = 7] = "BOTTOM_RIGHT";
        Sectors[Sectors["BOTTOM_LEFT"] = 8] = "BOTTOM_LEFT";
        Sectors[Sectors["ALL"] = 9] = "ALL";
    })(Gamepads.Sectors || (Gamepads.Sectors = {}));
    var Sectors = Gamepads.Sectors;
    /**
     * @class Joystick
     * @extends Phaser.Plugin
     *
     * Implements a floating joystick for touch screen devices
     */
    var Joystick = (function (_super) {
        __extends(Joystick, _super);
        function Joystick(game, sector, gamepadMode) {
            if (gamepadMode === void 0) { gamepadMode = true; }
            _super.call(this, game, new PIXI.DisplayObject());
            this.imageGroup = [];
            this.doUpdate = false;
            this.gamepadMode = true;
            this.game = game;
            this.sector = sector;
            this.gamepadMode = gamepadMode;
            this.pointer = this.game.input.pointer1;
            //Setup the images
            this.imageGroup.push(this.game.add.sprite(0, 0, 'joystick_base'));
            this.imageGroup.push(this.game.add.sprite(0, 0, 'joystick_segment'));
            this.imageGroup.push(this.game.add.sprite(0, 0, 'joystick_knob'));
            this.imageGroup.forEach(function (e) {
                e.anchor.set(0.5);
                e.visible = false;
                e.fixedToCamera = true;
            });
            //Setup Default Settings
            this.settings = {
                maxDistanceInPixels: 60,
                singleDirection: false,
                float: true,
                analog: true,
                topSpeed: 200
            };
            //Setup Default State
            this.cursors = {
                up: false,
                down: false,
                left: false,
                right: false
            };
            this.speed = {
                x: 0,
                y: 0
            };
            this.inputEnable();
        }
        /**
         * @function inputEnable
         * enables the plugin actions
         */
        Joystick.prototype.inputEnable = function () {
            this.game.input.onDown.add(this.createStick, this);
            this.game.input.onUp.add(this.removeStick, this);
            this.active = true;
        };
        /**
         * @function inputDisable
         * disables the plugin actions
         */
        Joystick.prototype.inputDisable = function () {
            this.game.input.onDown.remove(this.createStick, this);
            this.game.input.onUp.remove(this.removeStick, this);
            this.active = false;
        };
        Joystick.prototype.inSector = function (pointer) {
            var half_bottom = pointer.position.y > this.game.height / 2;
            var half_top = pointer.position.y < this.game.height / 2;
            var half_right = pointer.position.x > this.game.width / 2;
            var half_left = pointer.position.x < this.game.width / 2;
            if (this.sector == 9 /* ALL */)
                return true;
            if (this.sector == 1 /* HALF_LEFT */ && half_left)
                return true;
            if (this.sector == 3 /* HALF_RIGHT */ && half_right)
                return true;
            if (this.sector == 4 /* HALF_BOTTOM */ && half_bottom)
                return true;
            if (this.sector == 2 /* HALF_TOP */ && half_top)
                return true;
            if (this.sector == 5 /* TOP_LEFT */ && half_top && half_left)
                return true;
            if (this.sector == 6 /* TOP_RIGHT */ && half_top && half_right)
                return true;
            if (this.sector == 7 /* BOTTOM_RIGHT */ && half_bottom && half_right)
                return true;
            if (this.sector == 8 /* BOTTOM_LEFT */ && half_bottom && half_left)
                return true;
            return false;
        };
        /**
         * @function createStick
         * @param pointer
         *
         * visually creates the pad and starts accepting the inputs
         */
        Joystick.prototype.createStick = function (pointer) {
            //If this joystick is not in charge of monitoring the sector that was touched --> return
            if (!this.inSector(pointer))
                return;
            //Else update the pointer (it may be the first touch)
            this.pointer = pointer;
            this.imageGroup.forEach(function (e) {
                e.visible = true;
                e.bringToTop();
                e.cameraOffset.x = this.pointer.worldX;
                e.cameraOffset.y = this.pointer.worldY;
            }, this);
            //Allow updates on the stick while the screen is being touched
            this.doUpdate = true;
            //Start the Stick on the position that is being touched right now
            this.initialPoint = this.pointer.position.clone();
        };
        /**
         * @function removeStick
         * @param pointer
         *
         * Visually removes the stick and stops paying atention to input
         */
        Joystick.prototype.removeStick = function (pointer) {
            if (pointer.id != this.pointer.id)
                return;
            //Deny updates on the stick
            this.doUpdate = false;
            this.imageGroup.forEach(function (e) {
                e.visible = false;
            });
            this.cursors.up = false;
            this.cursors.down = false;
            this.cursors.left = false;
            this.cursors.right = false;
            this.speed.x = 0;
            this.speed.y = 0;
        };
        /**
         * @function receivingInput
         * @returns {boolean}
         *
         * Returns true if any of the joystick "contacts" is activated
         */
        Joystick.prototype.receivingInput = function () {
            return (this.cursors.up || this.cursors.down || this.cursors.left || this.cursors.right);
        };
        /**
         * @function preUpdate
         * Performs the preUpdate plugin actions
         */
        Joystick.prototype.preUpdate = function () {
            if (this.doUpdate) {
                this.setDirection();
            }
        };
        Joystick.prototype.setSingleDirection = function () {
            var d = this.initialPoint.distance(this.pointer.position);
            var maxDistanceInPixels = this.settings.maxDistanceInPixels;
            var deltaX = this.pointer.position.x - this.initialPoint.x;
            var deltaY = this.pointer.position.y - this.initialPoint.y;
            if (d < maxDistanceInPixels) {
                this.cursors.up = false;
                this.cursors.down = false;
                this.cursors.left = false;
                this.cursors.right = false;
                this.speed.x = 0;
                this.speed.y = 0;
                this.imageGroup.forEach(function (e, i) {
                    e.cameraOffset.x = this.initialPoint.x + (deltaX) * i / (this.imageGroup.length - 1);
                    e.cameraOffset.y = this.initialPoint.y + (deltaY) * i / (this.imageGroup.length - 1);
                }, this);
                return;
            }
            ;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                deltaY = 0;
                this.pointer.position.y = this.initialPoint.y;
            }
            else {
                deltaX = 0;
                this.pointer.position.x = this.initialPoint.x;
            }
            var angle = this.initialPoint.angle(this.pointer.position);
            if (d > maxDistanceInPixels) {
                deltaX = Math.cos(angle) * maxDistanceInPixels;
                deltaY = Math.sin(angle) * maxDistanceInPixels;
                if (this.settings.float) {
                    this.initialPoint.x = this.pointer.x - deltaX;
                    this.initialPoint.y = this.pointer.y - deltaY;
                }
            }
            this.speed.x = Math.round(Math.cos(angle) * this.settings.topSpeed);
            this.speed.y = Math.round(Math.sin(angle) * this.settings.topSpeed);
            angle = angle * 180 / Math.PI;
            this.cursors.up = angle == -90;
            this.cursors.down = angle == 90;
            this.cursors.left = angle == 180;
            this.cursors.right = angle == 0;
            this.imageGroup.forEach(function (e, i) {
                e.cameraOffset.x = this.initialPoint.x + (deltaX) * i / (this.imageGroup.length - 1);
                e.cameraOffset.y = this.initialPoint.y + (deltaY) * i / (this.imageGroup.length - 1);
            }, this);
        };
        /**
         * @function setDirection
         * Main Plugin function. Performs the calculations and updates the sprite positions
         */
        Joystick.prototype.setDirection = function () {
            if (this.settings.singleDirection) {
                this.setSingleDirection();
                return;
            }
            var d = this.initialPoint.distance(this.pointer.position);
            var maxDistanceInPixels = this.settings.maxDistanceInPixels;
            var deltaX = this.pointer.position.x - this.initialPoint.x;
            var deltaY = this.pointer.position.y - this.initialPoint.y;
            if (!this.settings.analog) {
                if (d < maxDistanceInPixels) {
                    this.cursors.up = false;
                    this.cursors.down = false;
                    this.cursors.left = false;
                    this.cursors.right = false;
                    this.speed.x = 0;
                    this.speed.y = 0;
                    this.imageGroup.forEach(function (e, i) {
                        e.cameraOffset.x = this.initialPoint.x + (deltaX) * i / (this.imageGroup.length - 1);
                        e.cameraOffset.y = this.initialPoint.y + (deltaY) * i / (this.imageGroup.length - 1);
                    }, this);
                    return;
                }
            }
            var angle = this.initialPoint.angle(this.pointer.position);
            if (d > maxDistanceInPixels) {
                deltaX = Math.cos(angle) * maxDistanceInPixels;
                deltaY = Math.sin(angle) * maxDistanceInPixels;
                if (this.settings.float) {
                    this.initialPoint.x = this.pointer.x - deltaX;
                    this.initialPoint.y = this.pointer.y - deltaY;
                }
            }
            if (this.settings.analog) {
                this.speed.x = Math.round((deltaX / maxDistanceInPixels) * this.settings.topSpeed);
                this.speed.y = Math.round((deltaY / maxDistanceInPixels) * this.settings.topSpeed);
            }
            else {
                this.speed.x = Math.round(Math.cos(angle) * this.settings.topSpeed);
                this.speed.y = Math.round(Math.sin(angle) * this.settings.topSpeed);
            }
            this.cursors.up = (deltaY < 0);
            this.cursors.down = (deltaY > 0);
            this.cursors.left = (deltaX < 0);
            this.cursors.right = (deltaX > 0);
            this.imageGroup.forEach(function (e, i) {
                e.cameraOffset.x = this.initialPoint.x + (deltaX) * i / (this.imageGroup.length - 1);
                e.cameraOffset.y = this.initialPoint.y + (deltaY) * i / (this.imageGroup.length - 1);
            }, this);
        };
        /**
         * @function preloadAssets
         * @static
         * @param game {Phaser.Game} - An instance of the current Game object
         * @param assets_path {String} - A relative path to the assets directory
         *
         * Static class that preloads all the necesary assets for the joystick. Should be called on the game
         * preload method
         */
        Joystick.preloadAssets = function (game, assets_path) {
            game.load.image('joystick_base', assets_path + '/joystick_base.png');
            game.load.image('joystick_segment', assets_path + '/joystick_segment.png');
            game.load.image('joystick_knob', assets_path + '/joystick_knob.png');
        };
        return Joystick;
    })(Phaser.Plugin);
    Gamepads.Joystick = Joystick;
})(Gamepads || (Gamepads = {}));
/// <reference path="../../lib/phaser.d.ts"/>
var Gamepads;
(function (Gamepads) {
    var PieMask = (function (_super) {
        __extends(PieMask, _super);
        function PieMask(game, radius, x, y, rotation, sides) {
            if (radius === void 0) { radius = 50; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (rotation === void 0) { rotation = 0; }
            if (sides === void 0) { sides = 6; }
            _super.call(this, game, x / 2, y / 2);
            this.atRest = false;
            this.game = game;
            this.radius = radius;
            this.rotation = rotation;
            this.moveTo(this.x, this.y);
            if (sides < 3)
                this.sides = 3; // 3 sides minimum
            else
                this.sides = sides;
            this.game.add.existing(this);
        }
        PieMask.prototype.drawCircleAtSelf = function () {
            this.drawCircle(this.x, this.y, this.radius * 2);
        };
        PieMask.prototype.drawWithFill = function (pj, color, alpha) {
            if (color === void 0) { color = 0; }
            if (alpha === void 0) { alpha = 1; }
            this.clear();
            this.beginFill(color, alpha);
            this.draw(pj);
            this.endFill();
        };
        PieMask.prototype.lineToRadians = function (rads, radius) {
            this.lineTo(Math.cos(rads) * radius + this.x, Math.sin(rads) * radius + this.y);
        };
        PieMask.prototype.draw = function (pj) {
            // graphics should have its beginFill function already called by now
            this.moveTo(this.x, this.y);
            var radius = this.radius;
            // Increase the length of the radius to cover the whole target
            radius /= Math.cos(1 / this.sides * Math.PI);
            // Find how many sides we have to draw
            var sidesToDraw = Math.floor(pj * this.sides);
            for (var i = 0; i <= sidesToDraw; i++)
                this.lineToRadians((i / this.sides) * (Math.PI * 2) + this.rotation, radius);
            // Draw the last fractioned side
            if (pj * this.sides != sidesToDraw)
                this.lineToRadians(pj * (Math.PI * 2) + this.rotation, radius);
        };
        return PieMask;
    })(Phaser.Graphics);
    Gamepads.PieMask = PieMask;
})(Gamepads || (Gamepads = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Utils.ts"/>
var Gamepads;
(function (Gamepads) {
    (function (ButtonType) {
        ButtonType[ButtonType["SINGLE"] = 1] = "SINGLE";
        ButtonType[ButtonType["TURBO"] = 2] = "TURBO";
        ButtonType[ButtonType["DELAYED_TURBO"] = 3] = "DELAYED_TURBO";
        ButtonType[ButtonType["SINGLE_THEN_TURBO"] = 4] = "SINGLE_THEN_TURBO";
        ButtonType[ButtonType["CUSTOM"] = 5] = "CUSTOM";
    })(Gamepads.ButtonType || (Gamepads.ButtonType = {}));
    var ButtonType = Gamepads.ButtonType;
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(game, x, y, key, onPressedCallback, listenerContext, type, width, height) {
            if (type === void 0) { type = 4 /* SINGLE_THEN_TURBO */; }
            _super.call(this, game, new PIXI.DisplayObject());
            this.pressed = false;
            this.game = game;
            this.type = type;
            this.sprite = this.game.add.sprite(x, y, key);
            this.width = width || this.sprite.width;
            this.height = height || this.sprite.height;
            this.sprite.inputEnabled = true;
            this.cooldown = {
                enabled: false,
                seconds: 0,
                timer: 0
            };
            if (onPressedCallback == undefined) {
                this.onPressedCallback = this.empty;
            }
            else {
                this.onPressedCallback = onPressedCallback.bind(listenerContext);
            }
            //By default the custom canTriggerCallback User control is empty.
            this.customCanTriggerCallback = this.empty;
            this.sprite.events.onInputDown.add(this.pressButton, this);
            this.sprite.events.onInputUp.add(this.releaseButton, this);
            this.sprite.anchor.setTo(1, 1);
            this.active = true;
        }
        Button.prototype.empty = function () {
            return true;
        };
        Button.prototype.enableCooldown = function (seconds) {
            this.cooldown.enabled = true;
            this.cooldown.seconds = seconds;
            this.cooldown.timer = this.game.time.time;
            var mask_x = this.sprite.x - (this.sprite.width / 2);
            var mask_y = this.sprite.y - (this.sprite.height / 2);
            var mask_radius = Math.max(this.sprite.width, this.sprite.height) / 2;
            this.sprite.mask = new Superhero.PieMask(this.game, mask_radius, mask_x, mask_y);
        };
        Button.prototype.disableCooldown = function () {
            this.cooldown.enabled = false;
            this.sprite.mask.drawCircleAtSelf();
            this.sprite.mask.atRest = true;
        };
        Button.prototype.pressButton = function () {
            switch (this.type) {
                case 1 /* SINGLE */:
                    this.triggerCallback();
                    break;
                case 2 /* TURBO */:
                    this.pressed = true;
                    break;
                case 3 /* DELAYED_TURBO */:
                    this.timerId = setTimeout(function () {
                        this.pressed = true;
                    }.bind(this), 300);
                    break;
                case 4 /* SINGLE_THEN_TURBO */:
                    this.triggerCallback();
                    this.timerId = setTimeout(function () {
                        this.pressed = true;
                    }.bind(this), 300);
                    break;
                default:
                    this.pressed = true;
            }
        };
        Button.prototype.releaseButton = function () {
            this.pressed = false;
            clearTimeout(this.timerId);
        };
        Button.prototype.triggerCallback = function () {
            if (this.canTriggerCallback() && this.customCanTriggerCallback()) {
                this.onPressedCallback();
                if (this.cooldown.enabled) {
                    this.cooldown.timer = this.game.time.time;
                    this.sprite.mask.atRest = false;
                }
            }
        };
        Button.prototype.setOnPressedCallback = function (listener, listenerContext) {
            this.onPressedCallback = listener.bind(listenerContext);
        };
        Button.prototype.isTriggerTimerUp = function () {
            var elapsed = this.game.time.elapsedSecondsSince(this.cooldown.timer);
            return (elapsed > this.cooldown.seconds);
        };
        Button.prototype.canTriggerCallback = function () {
            if (!this.cooldown.enabled)
                return true;
            return this.isTriggerTimerUp();
        };
        Button.prototype.updatePieMask = function () {
            if (this.sprite.mask.atRest)
                return;
            if (this.isTriggerTimerUp()) {
                if (!this.sprite.mask.atRest) {
                    this.sprite.mask.drawCircleAtSelf();
                    this.sprite.mask.atRest = true;
                }
                return;
            }
            var elapsed = this.game.time.elapsedSecondsSince(this.cooldown.timer);
            var pj = elapsed / this.cooldown.seconds;
            this.sprite.mask.drawWithFill(pj, 0xFFFFFF, 1);
            this.sprite.mask.atRest = false;
        };
        Button.prototype.update = function () {
            if (this.pressed) {
                if (this.type != 5 /* CUSTOM */) {
                    this.triggerCallback();
                }
            }
            if (this.cooldown.enabled) {
                this.updatePieMask();
            }
        };
        return Button;
    })(Phaser.Plugin);
    Gamepads.Button = Button;
})(Gamepads || (Gamepads = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Button.ts"/>
var Gamepads;
(function (Gamepads) {
    (function (ButtonPadType) {
        ButtonPadType[ButtonPadType["ONE_FIXED"] = 1] = "ONE_FIXED";
        ButtonPadType[ButtonPadType["TWO_INLINE_X"] = 2] = "TWO_INLINE_X";
        ButtonPadType[ButtonPadType["TWO_INLINE_Y"] = 3] = "TWO_INLINE_Y";
        ButtonPadType[ButtonPadType["THREE_INLINE_X"] = 4] = "THREE_INLINE_X";
        ButtonPadType[ButtonPadType["THREE_INLINE_Y"] = 5] = "THREE_INLINE_Y";
        ButtonPadType[ButtonPadType["THREE_FAN"] = 6] = "THREE_FAN";
        ButtonPadType[ButtonPadType["FOUR_STACK"] = 7] = "FOUR_STACK";
        ButtonPadType[ButtonPadType["FOUR_INLINE_X"] = 8] = "FOUR_INLINE_X";
        ButtonPadType[ButtonPadType["FOUR_INLINE_Y"] = 9] = "FOUR_INLINE_Y";
        ButtonPadType[ButtonPadType["FOUR_FAN"] = 10] = "FOUR_FAN";
        ButtonPadType[ButtonPadType["FIVE_FAN"] = 11] = "FIVE_FAN";
    })(Gamepads.ButtonPadType || (Gamepads.ButtonPadType = {}));
    var ButtonPadType = Gamepads.ButtonPadType;
    var ButtonPad = (function (_super) {
        __extends(ButtonPad, _super);
        function ButtonPad(game, type, buttonSize) {
            _super.call(this, game, new PIXI.DisplayObject());
            this.padding = 10;
            this.game = game;
            this.type = type;
            this.buttonSize = buttonSize;
            switch (this.type) {
                case 1 /* ONE_FIXED */:
                    this.initOneFixed();
                    break;
                case 2 /* TWO_INLINE_X */:
                    this.initTwoInlineX();
                    break;
                case 4 /* THREE_INLINE_X */:
                    this.initThreeInlineX();
                    break;
                case 8 /* FOUR_INLINE_X */:
                    this.initFourInlineX();
                    break;
                case 3 /* TWO_INLINE_Y */:
                    this.initTwoInlineY();
                    break;
                case 5 /* THREE_INLINE_Y */:
                    this.initThreeInlineY();
                    break;
                case 9 /* FOUR_INLINE_Y */:
                    this.initFourInlineY();
                    break;
                case 7 /* FOUR_STACK */:
                    this.initFourStack();
                    break;
                case 6 /* THREE_FAN */:
                    this.initThreeFan();
                    break;
                case 10 /* FOUR_FAN */:
                    this.initFourFan();
                    break;
                case 11 /* FIVE_FAN */:
                    this.initFiveFan();
                    break;
            }
        }
        ButtonPad.prototype.initOneFixed = function () {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.game.height - this.padding;
            this.button1 = new Gamepads.Button(this.game, offsetX, offsetY, 'button1');
            this.game.add.plugin(this.button1);
            return offsetX;
        };
        ButtonPad.prototype.initTwoInlineX = function () {
            var offsetX = this.initOneFixed();
            var offsetY = this.game.height - this.padding;
            offsetX = offsetX - this.buttonSize - this.padding;
            this.button2 = new Gamepads.Button(this.game, offsetX, offsetY, 'button2');
            this.game.add.plugin(this.button2);
            return offsetX;
        };
        ButtonPad.prototype.initThreeInlineX = function () {
            var offsetX = this.initTwoInlineX();
            var offsetY = this.game.height - this.padding;
            offsetX = offsetX - this.buttonSize - this.padding;
            this.button3 = new Gamepads.Button(this.game, offsetX, offsetY, 'button3');
            this.game.add.plugin(this.button3);
            return offsetX;
        };
        ButtonPad.prototype.initFourInlineX = function () {
            var offsetX = this.initThreeInlineX();
            var offsetY = this.game.height - this.padding;
            offsetX = offsetX - this.buttonSize - this.padding;
            this.button4 = new Gamepads.Button(this.game, offsetX, offsetY, 'button4');
            this.game.add.plugin(this.button4);
            return offsetX;
        };
        ButtonPad.prototype.initTwoInlineY = function () {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.game.height - this.padding;
            this.button1 = new Gamepads.Button(this.game, offsetX, offsetY, 'button1');
            offsetY = offsetY - this.buttonSize - this.padding;
            this.button2 = new Gamepads.Button(this.game, offsetX, offsetY, 'button2');
            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            return offsetY;
        };
        ButtonPad.prototype.initThreeInlineY = function () {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.initTwoInlineY();
            offsetY = offsetY - this.buttonSize - this.padding;
            this.button3 = new Gamepads.Button(this.game, offsetX, offsetY, 'button3');
            this.game.add.plugin(this.button3);
            return offsetY;
        };
        ButtonPad.prototype.initFourInlineY = function () {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.initThreeInlineY();
            offsetY = offsetY - this.buttonSize - this.padding;
            this.button4 = new Gamepads.Button(this.game, offsetX, offsetY, 'button4');
            this.game.add.plugin(this.button4);
            return offsetY;
        };
        ButtonPad.prototype.initFourStack = function () {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.game.height - this.padding;
            this.button1 = new Gamepads.Button(this.game, offsetX, offsetY, 'button1');
            offsetY = offsetY - this.buttonSize - this.padding;
            this.button2 = new Gamepads.Button(this.game, offsetX, offsetY, 'button2');
            var offsetX = offsetX - this.buttonSize - this.padding;
            var offsetY = this.game.height - this.padding;
            this.button3 = new Gamepads.Button(this.game, offsetX, offsetY, 'button3');
            offsetY = offsetY - this.buttonSize - this.padding;
            this.button4 = new Gamepads.Button(this.game, offsetX, offsetY, 'button4');
            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            this.game.add.plugin(this.button3);
            this.game.add.plugin(this.button4);
        };
        ButtonPad.prototype.toRadians = function (angle) {
            return angle * (Math.PI / 180);
        };
        ButtonPad.prototype.toDegrees = function (angle) {
            return angle * (180 / Math.PI);
        };
        ButtonPad.prototype.initThreeFan = function () {
            //Arc Center X,Y Coordinates
            var cx = this.game.width - 3 * this.padding;
            var cy = this.game.height - 3 * this.padding;
            var radius = this.buttonSize * 1.5;
            var angleStep = 100 / 2;
            var angle = 175;
            angle = this.toRadians(angle);
            angleStep = this.toRadians(angleStep);
            //Button 1
            var bx = cx + Math.cos(angle) * radius;
            var by = cy + Math.sin(angle) * radius;
            this.button1 = new Gamepads.Button(this.game, bx, by, 'button1');
            this.button1.sprite.scale.setTo(0.7);
            //Button 2
            bx = cx + Math.cos(angle + angleStep) * radius;
            by = cy + Math.sin(angle + angleStep) * radius;
            this.button2 = new Gamepads.Button(this.game, bx, by, 'button2');
            this.button2.sprite.scale.setTo(0.7);
            //Button 3
            bx = cx + Math.cos(angle + (angleStep * 2)) * radius;
            by = cy + Math.sin(angle + (angleStep * 2)) * radius;
            this.button3 = new Gamepads.Button(this.game, bx, by, 'button3');
            this.button3.sprite.scale.setTo(0.7);
            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            this.game.add.plugin(this.button3);
        };
        ButtonPad.prototype.initFourFan = function () {
            //Arc Center X,Y Coordinates
            var cx = this.game.width - 3 * this.padding;
            var cy = this.game.height - 3 * this.padding;
            var radius = this.buttonSize * 1.5;
            var angleStep = 100 / 2;
            var angle = 175;
            angle = this.toRadians(angle);
            angleStep = this.toRadians(angleStep);
            this.button1 = new Gamepads.Button(this.game, cx - this.padding, cy - this.padding, 'button1');
            this.button1.sprite.scale.setTo(1.3);
            //Button 2
            var bx = cx + Math.cos(angle) * radius;
            var by = cy + Math.sin(angle) * radius;
            this.button2 = new Gamepads.Button(this.game, bx, by, 'button2');
            this.button2.sprite.scale.setTo(0.8);
            //Button 3
            bx = cx + Math.cos(angle + angleStep) * radius;
            by = cy + Math.sin(angle + angleStep) * radius;
            this.button3 = new Gamepads.Button(this.game, bx, by, 'button3');
            this.button3.sprite.scale.setTo(0.8);
            //Button 4
            bx = cx + Math.cos(angle + (angleStep * 2)) * radius;
            by = cy + Math.sin(angle + (angleStep * 2)) * radius;
            this.button4 = new Gamepads.Button(this.game, bx, by, 'button4');
            this.button4.sprite.scale.setTo(0.8);
            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            this.game.add.plugin(this.button3);
            this.game.add.plugin(this.button4);
        };
        ButtonPad.prototype.initFiveFan = function () {
            //Arc Center X,Y Coordinates
            var cx = this.game.width - 3 * this.padding;
            var cy = this.game.height - 3 * this.padding;
            var radius = this.buttonSize * 1.5;
            var angleStep = 100 / 3;
            var angle = 175;
            angle = this.toRadians(angle);
            angleStep = this.toRadians(angleStep);
            this.button1 = new Gamepads.Button(this.game, cx, cy, 'button1');
            this.button1.sprite.scale.setTo(1.2);
            //Button 2
            var bx = cx + Math.cos(angle) * radius;
            var by = cy + Math.sin(angle) * radius;
            this.button2 = new Gamepads.Button(this.game, bx, by, 'button2');
            this.button2.sprite.scale.setTo(0.7);
            //Button 3
            bx = cx + Math.cos(angle + angleStep) * radius;
            by = cy + Math.sin(angle + angleStep) * radius;
            this.button3 = new Gamepads.Button(this.game, bx, by, 'button3');
            this.button3.sprite.scale.setTo(0.7);
            //Button 4
            bx = cx + Math.cos(angle + (angleStep * 2)) * radius;
            by = cy + Math.sin(angle + (angleStep * 2)) * radius;
            this.button4 = new Gamepads.Button(this.game, bx, by, 'button4');
            this.button4.sprite.scale.setTo(0.7);
            //Button 5
            bx = cx + Math.cos(angle + (angleStep * 3)) * radius;
            by = cy + Math.sin(angle + (angleStep * 3)) * radius;
            this.button5 = new Gamepads.Button(this.game, bx, by, 'button5');
            this.button5.sprite.scale.setTo(0.7);
            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            this.game.add.plugin(this.button3);
            this.game.add.plugin(this.button4);
            this.game.add.plugin(this.button5);
        };
        ButtonPad.preloadAssets = function (game, assets_path) {
            game.load.image('button1', assets_path + '/button1.png');
            game.load.image('button2', assets_path + '/button2.png');
            game.load.image('button3', assets_path + '/button3.png');
            game.load.image('button4', assets_path + '/button4.png');
            game.load.image('button5', assets_path + '/button5.png');
        };
        return ButtonPad;
    })(Phaser.Plugin);
    Gamepads.ButtonPad = ButtonPad;
})(Gamepads || (Gamepads = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Joystick.ts"/>
var Gamepads;
(function (Gamepads) {
    (function (TouchInputType) {
        TouchInputType[TouchInputType["TOUCH"] = 1] = "TOUCH";
        TouchInputType[TouchInputType["SWIPE"] = 2] = "SWIPE";
    })(Gamepads.TouchInputType || (Gamepads.TouchInputType = {}));
    var TouchInputType = Gamepads.TouchInputType;
    var TouchInput = (function (_super) {
        __extends(TouchInput, _super);
        function TouchInput(game, sector, type) {
            if (type === void 0) { type = 2 /* SWIPE */; }
            _super.call(this, game, new PIXI.DisplayObject());
            this.screenPressed = false;
            this.swipeThreshold = 100;
            this.game = game;
            this.sector = sector;
            this.touchType = type;
            this.pointer = this.game.input.pointer1;
            this.swipeDownCallback = this.empty;
            this.swipeLeftCallback = this.empty;
            this.swipeRightCallback = this.empty;
            this.swipeUpCallback = this.empty;
            this.onTouchDownCallback = this.empty;
            this.onTouchReleaseCallback = this.empty;
            //Setup Default State
            this.swipe = {
                up: false,
                down: false,
                left: false,
                right: false
            };
            this.inputEnable();
        }
        TouchInput.prototype.inputEnable = function () {
            this.game.input.onDown.add(this.startGesture, this);
            this.game.input.onUp.add(this.endGesture, this);
            this.active = true;
        };
        TouchInput.prototype.inputDisable = function () {
            this.game.input.onDown.remove(this.startGesture, this);
            this.game.input.onUp.remove(this.endGesture, this);
            this.active = false;
        };
        TouchInput.prototype.inSector = function (pointer) {
            var half_bottom = pointer.position.y > this.game.height / 2;
            var half_top = pointer.position.y < this.game.height / 2;
            var half_right = pointer.position.x > this.game.width / 2;
            var half_left = pointer.position.x < this.game.width / 2;
            if (this.sector == 9 /* ALL */)
                return true;
            if (this.sector == 1 /* HALF_LEFT */ && half_left)
                return true;
            if (this.sector == 3 /* HALF_RIGHT */ && half_right)
                return true;
            if (this.sector == 4 /* HALF_BOTTOM */ && half_bottom)
                return true;
            if (this.sector == 2 /* HALF_TOP */ && half_top)
                return true;
            if (this.sector == 5 /* TOP_LEFT */ && half_top && half_left)
                return true;
            if (this.sector == 6 /* TOP_RIGHT */ && half_top && half_right)
                return true;
            if (this.sector == 7 /* BOTTOM_RIGHT */ && half_bottom && half_right)
                return true;
            if (this.sector == 8 /* BOTTOM_LEFT */ && half_bottom && half_left)
                return true;
            return false;
        };
        TouchInput.prototype.startGesture = function (pointer) {
            //If this joystick is not in charge of monitoring the sector that was touched --> return
            if (!this.inSector(pointer))
                return;
            this.touchTimer = this.game.time.time;
            this.screenPressed = true;
            //Else update the pointer (it may be the first touch)
            this.pointer = pointer;
            //Start the Stick on the position that is being touched right now
            this.initialPoint = this.pointer.position.clone();
            if (this.touchType == 1 /* TOUCH */) {
                this.onTouchDownCallback();
            }
        };
        /**
         * @function removeStick
         * @param pointer
         *
         * Visually removes the stick and stops paying atention to input
         */
        TouchInput.prototype.endGesture = function (pointer) {
            if (pointer.id != this.pointer.id)
                return;
            this.screenPressed = false;
            var elapsedTime = this.game.time.elapsedSecondsSince(this.touchTimer);
            if (this.touchType == 1 /* TOUCH */) {
                this.onTouchReleaseCallback(elapsedTime);
                return;
            }
            var d = this.initialPoint.distance(this.pointer.position);
            if (d < this.swipeThreshold)
                return;
            var deltaX = this.pointer.position.x - this.initialPoint.x;
            var deltaY = this.pointer.position.y - this.initialPoint.y;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                this.pointer.position.y = this.initialPoint.y;
            }
            else {
                this.pointer.position.x = this.initialPoint.x;
            }
            var angle = this.initialPoint.angle(this.pointer.position);
            angle = angle * 180 / Math.PI;
            this.swipe.up = angle == -90;
            this.swipe.down = angle == 90;
            this.swipe.left = angle == 180;
            this.swipe.right = angle == 0;
            if (this.swipe.up)
                this.swipeUpCallback();
            if (this.swipe.down)
                this.swipeDownCallback();
            if (this.swipe.left)
                this.swipeLeftCallback();
            if (this.swipe.right)
                this.swipeRightCallback();
        };
        TouchInput.prototype.empty = function (par) {
        };
        /**
         * @function preloadAssets
         * @static
         * @param game {Phaser.Game} - An instance of the current Game object
         * @param assets_path {String} - A relative path to the assets directory
         *
         * Static class that preloads all the necesary assets for the joystick. Should be called on the game
         * preload method
         */
        TouchInput.preloadAssets = function (game, assets_path) {
            game.load.image('joystick_base', assets_path + '/joystick_base.png');
            game.load.image('joystick_segment', assets_path + '/joystick_segment.png');
            game.load.image('joystick_knob', assets_path + '/joystick_knob.png');
        };
        return TouchInput;
    })(Phaser.Plugin);
    Gamepads.TouchInput = TouchInput;
})(Gamepads || (Gamepads = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Joystick.ts"/>
/// <reference path="Button.ts"/>
/// <reference path="ButtonPad.ts"/>
/// <reference path="TouchInput.ts"/>
var Gamepads;
(function (Gamepads) {
    (function (GamepadType) {
        GamepadType[GamepadType["SINGLE_STICK"] = 1] = "SINGLE_STICK";
        GamepadType[GamepadType["DOUBLE_STICK"] = 2] = "DOUBLE_STICK";
        GamepadType[GamepadType["STICK_BUTTON"] = 3] = "STICK_BUTTON";
        GamepadType[GamepadType["CORNER_STICKS"] = 4] = "CORNER_STICKS";
        GamepadType[GamepadType["GESTURE_BUTTON"] = 5] = "GESTURE_BUTTON";
        GamepadType[GamepadType["GESTURE"] = 6] = "GESTURE";
    })(Gamepads.GamepadType || (Gamepads.GamepadType = {}));
    var GamepadType = Gamepads.GamepadType;
    var GamePad = (function (_super) {
        __extends(GamePad, _super);
        function GamePad(game, type, buttonPadType) {
            _super.call(this, game, new PIXI.DisplayObject());
            this.test = 0;
            this.game = game;
            switch (type) {
                case 2 /* DOUBLE_STICK */:
                    this.initDoublStick();
                    break;
                case 1 /* SINGLE_STICK */:
                    this.initSingleStick();
                    break;
                case 3 /* STICK_BUTTON */:
                    this.initStickButton(buttonPadType);
                    break;
                case 4 /* CORNER_STICKS */:
                    this.initCornerSticks();
                    break;
                case 5 /* GESTURE_BUTTON */:
                    this.initGestureButton(buttonPadType);
                    break;
                case 6 /* GESTURE */:
                    this.initGesture();
                    break;
            }
        }
        GamePad.prototype.initDoublStick = function () {
            this.stick1 = new Gamepads.Joystick(this.game, 1 /* HALF_LEFT */);
            this.stick2 = new Gamepads.Joystick(this.game, 3 /* HALF_RIGHT */);
            this.game.add.plugin(this.stick1, null);
            this.game.add.plugin(this.stick2, null);
        };
        GamePad.prototype.initCornerSticks = function () {
            //Add 2 extra pointers (2 by default + 2 Extra)
            this.game.input.addPointer();
            this.game.input.addPointer();
            this.stick1 = new Gamepads.Joystick(this.game, 8 /* BOTTOM_LEFT */);
            this.stick2 = new Gamepads.Joystick(this.game, 5 /* TOP_LEFT */);
            this.stick3 = new Gamepads.Joystick(this.game, 6 /* TOP_RIGHT */);
            this.stick4 = new Gamepads.Joystick(this.game, 7 /* BOTTOM_RIGHT */);
            this.game.add.plugin(this.stick1, null);
            this.game.add.plugin(this.stick2, null);
            this.game.add.plugin(this.stick3, null);
            this.game.add.plugin(this.stick4, null);
        };
        GamePad.prototype.initSingleStick = function () {
            this.stick1 = new Gamepads.Joystick(this.game, 9 /* ALL */);
            this.game.add.plugin(this.stick1, null);
        };
        GamePad.prototype.initStickButton = function (buttonPadType) {
            this.stick1 = new Gamepads.Joystick(this.game, 1 /* HALF_LEFT */);
            this.game.add.plugin(this.stick1, null);
            this.buttonPad = new Gamepads.ButtonPad(this.game, buttonPadType, 100);
        };
        GamePad.prototype.initGestureButton = function (buttonPadType) {
            this.touchInput = new Gamepads.TouchInput(this.game, 1 /* HALF_LEFT */);
            this.buttonPad = new Gamepads.ButtonPad(this.game, buttonPadType, 100);
        };
        GamePad.prototype.initGesture = function () {
            this.touchInput = new Gamepads.TouchInput(this.game, 9 /* ALL */);
        };
        GamePad.preloadAssets = function (game, assets_path) {
            Gamepads.Joystick.preloadAssets(game, assets_path);
            Gamepads.ButtonPad.preloadAssets(game, assets_path);
        };
        return GamePad;
    })(Phaser.Plugin);
    Gamepads.GamePad = GamePad;
})(Gamepads || (Gamepads = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>
/// <reference path="../plugins/GamePad.ts"/>
var Superhero;
(function (Superhero) {
    /**
     * Enemy possible states
     */
    (function (EnemyState) {
        EnemyState[EnemyState["STEADY"] = 0] = "STEADY";
        EnemyState[EnemyState["PATROL"] = 1] = "PATROL";
    })(Superhero.EnemyState || (Superhero.EnemyState = {}));
    var EnemyState = Superhero.EnemyState;
    /**
     * Contains all the generic behaviour for the States.
     * @class BaseState
     * @implements CharState
     * @param {Phaser.Game} game - the instance of the current game
     * @param {Superhero.Character} hero - the instance of the player character
     *
     */
    var BaseState = (function () {
        /**
         * @param {Phaser.game} game instance
         * @param {Superher.Character} hero instance
         */
        function BaseState(game, hero) {
            this.game = game;
            // Is hero used for all the characters? even if it's an enemy?
            this.hero = hero;
            // Are we adding to all the enemies the gamePad, fireButton and heroStick?
            this.gamepad = this.game.gamepad;
            this.fireButton = this.gamepad.buttonPad.button1;
            this.nukeButton = this.gamepad.buttonPad.button2;
            this.warpButton = this.gamepad.buttonPad.button3;
            this.bombButton = this.gamepad.buttonPad.button4;
            this.heroStick = this.gamepad.stick1;
            this.fxEnabled = this.game.conf.ISMUSICENABLED;
            this.musicEnabled = this.game.conf.ISMUSICENABLED;
        }
        BaseState.prototype.update = function () {
            return null;
        };
        BaseState.prototype.enterState = function () {
        };
        BaseState.prototype.exitState = function () {
        };
        return BaseState;
    })();
    ///**
    // * STATE_IDLE Class
    // */
    var StateIdle = (function (_super) {
        __extends(StateIdle, _super);
        function StateIdle() {
            _super.apply(this, arguments);
        }
        StateIdle.prototype.update = function () {
            if (this.hero.sprite.alive) {
                if (this.heroStick) {
                    if (this.heroStick.receivingInput()) {
                        return new StateFly(this.game, this.hero);
                    }
                }
                else {
                    return new StateIntroFly(this.game, this.hero);
                }
            }
            //If nothing was commanded remain on the same state
            return this;
        };
        StateIdle.prototype.enterState = function () {
        };
        StateIdle.prototype.exitState = function () {
        };
        return StateIdle;
    })(BaseState);
    Superhero.StateIdle = StateIdle;
    ///**
    // * STATE_FLY Class
    // */
    var StateFly = (function (_super) {
        __extends(StateFly, _super);
        function StateFly() {
            _super.apply(this, arguments);
        }
        StateFly.prototype.update = function () {
            if (this.hero.sprite.alive) {
                if (Math.abs(this.heroStick.speed.x) > 0 || Math.abs(this.heroStick.speed.y) > 0) {
                    this.hero.move(this.heroStick.speed);
                }
                this.hero.sprite.play('flystill');
                if (this.heroStick.cursors.right) {
                    return new StateSprint(this.game, this.hero);
                }
                if (!this.heroStick.receivingInput()) {
                    return new StateIdle(this.game, this.hero);
                }
            }
            return this;
        };
        StateFly.prototype.enterState = function () {
        };
        StateFly.prototype.exitState = function () {
        };
        return StateFly;
    })(BaseState);
    Superhero.StateFly = StateFly;
    ///**
    // * STATE_FLY Class
    // */
    var StateIntroFly = (function (_super) {
        __extends(StateIntroFly, _super);
        function StateIntroFly() {
            _super.apply(this, arguments);
        }
        StateIntroFly.prototype.update = function () {
            if (this.hero.sprite.alive) {
                this.hero.sprite.play('flystill');
                this.hero.sprite.body.velocity.y = -50;
                this.hero.sprite.body.velocity.x = 190;
            }
            return this;
        };
        StateIntroFly.prototype.enterState = function () {
        };
        StateIntroFly.prototype.exitState = function () {
        };
        return StateIntroFly;
    })(BaseState);
    Superhero.StateIntroFly = StateIntroFly;
    ///**
    // * STATE_SPRINT Class
    // */
    var StateSprint = (function (_super) {
        __extends(StateSprint, _super);
        function StateSprint() {
            _super.apply(this, arguments);
        }
        StateSprint.prototype.update = function () {
            if (this.hero.sprite.alive) {
                this.hero.sprite.play('fly');
                if (Math.abs(this.heroStick.speed.x) > 0 || Math.abs(this.heroStick.speed.y) > 0) {
                    this.hero.move(this.heroStick.speed);
                }
                if (!this.heroStick.receivingInput()) {
                    return new StateIdle(this.game, this.hero);
                }
                if (!this.heroStick.cursors.right) {
                    return new StateFly(this.game, this.hero);
                }
            }
            return this;
        };
        StateSprint.prototype.enterState = function () {
        };
        StateSprint.prototype.exitState = function () {
            this.hero.stop();
        };
        return StateSprint;
    })(BaseState);
    Superhero.StateSprint = StateSprint;
    ///**
    // * Hostile state Class
    // */
    var StateEnemyHostile = (function (_super) {
        __extends(StateEnemyHostile, _super);
        function StateEnemyHostile() {
            _super.apply(this, arguments);
        }
        StateEnemyHostile.prototype.patrol = function (patrolPoint) {
            this.tween = this.game.add.tween(this.hero.sprite);
            if (this.hero.sprite.key == "miniBoss") {
                // TODO: implement method for miniBoss longPatrol
                this.tween.to({ y: this.game.world.y }, 3000, Phaser.Easing.Linear.None, true, 0, -1, true);
            }
            else {
                if (patrolPoint == 150 /* TOP */) {
                    this.tween.to({ y: this.game.world.centerY - 50 }, this.game.conf.ENEMIES.patrolTweenSpeed, Phaser.Easing.Linear.None, true, 0, -1, true);
                }
                else {
                    if (patrolPoint == 150 /* TOP */) {
                        this.tween.to({ y: this.game.world.centerY - 50 }, this.game.conf.ENEMIES.patrolTweenSpeed, Phaser.Easing.Linear.None, true, 0, -1, true);
                    }
                    else {
                        this.tween.to({ y: this.game.world.centerY + 50 }, this.game.conf.ENEMIES.patrolTweenSpeed, Phaser.Easing.Linear.None, true, 0, -1, true);
                    }
                }
            }
        };
        StateEnemyHostile.prototype.engage = function () {
            this.hero.sirenSound.loop = false;
            if (!this.hero.missileSound.isPlaying) {
                if (this.fxEnabled)
                    this.hero.missileSound.play();
            }
            this.stopPatrol();
            this.hero.sprite.alpha = 1;
            this.hero.sprite.body.enable = true;
            this.hero.sprite.body.velocity.x = -1000;
            this.hero.sprite.checkWorldBounds = true;
            this.hero.sprite.outOfBoundsKill = true;
        };
        StateEnemyHostile.prototype.startWarning = function () {
            this.hero.sirenSound.loop = true;
            if (this.fxEnabled)
                this.hero.warningSound.play();
            if (this.fxEnabled)
                this.hero.sirenSound.play();
            this.hero.sprite.animations.play("flystill");
            this.hero.sprite.body.enable = false;
            this.hero.sprite.alpha = 0;
            this.tween = this.game.add.tween(this.hero.sprite);
            this.tween.to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, 1000, true);
        };
        StateEnemyHostile.prototype.resumePatrol = function () {
            if (this.tween) {
                if (this.hero.isPatrolling) {
                    this.tween.resume();
                }
            }
        };
        StateEnemyHostile.prototype.stopPatrol = function () {
            if (this.tween) {
                this.tween.stop();
            }
        };
        StateEnemyHostile.prototype.pausePatrol = function () {
            if (this.tween) {
                this.tween.pause();
            }
        };
        StateEnemyHostile.prototype.update = function () {
            if (this.hero.sprite.alive) {
                this.hero.fire();
            }
            return this;
        };
        StateEnemyHostile.prototype.enterState = function () {
        };
        StateEnemyHostile.prototype.exitState = function () {
        };
        return StateEnemyHostile;
    })(BaseState);
    Superhero.StateEnemyHostile = StateEnemyHostile;
    // SM LevelIntro
    /**
     * STATE_RUN Class
     */
    var StateRun = (function (_super) {
        __extends(StateRun, _super);
        function StateRun() {
            _super.apply(this, arguments);
            this.isMoving = true;
        }
        StateRun.prototype.update = function () {
            if (this.hero.sprite.animations.currentAnim.isFinished) {
                this.hero.sprite.animations.play('run');
                if (!this.isMoving) {
                    this.hero.sprite.animations.paused = true;
                }
            }
            //If nothing was commanded remain on the same state
            return this;
        };
        StateRun.prototype.enterState = function () {
            this.hero.sprite.play('run');
        };
        StateRun.prototype.exitState = function () {
        };
        return StateRun;
    })(BaseState);
    Superhero.StateRun = StateRun;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Character.ts"/>
/// <reference path="../character/Hero.ts"/>
var Collectables;
(function (Collectables) {
    var BaseCollectable = (function (_super) {
        __extends(BaseCollectable, _super);
        function BaseCollectable(game, key) {
            _super.call(this, game, 100, 100, 'pupanim', key);
            this.initPhysics();
            this.loadAnimation();
            this.loadSound();
        }
        BaseCollectable.prototype.loadAnimation = function () {
        };
        BaseCollectable.prototype.loadSound = function () {
        };
        BaseCollectable.prototype.playSound = function () {
            this.fxEnabled = this.game.conf.ISMUSICENABLED;
            if (this.fxEnabled)
                this.collectSound.play();
        };
        BaseCollectable.prototype.playAnimation = function () {
            this.animations.play('main');
        };
        BaseCollectable.prototype.initPhysics = function () {
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.alive = false;
            this.visible = false;
            this.checkWorldBounds = true;
            this.outOfBoundsKill = true;
        };
        BaseCollectable.prototype.spawnAt = function (x, y) {
            this.scale.setTo(0.5);
            this.reset(x, y);
            this.resetFloatation();
        };
        BaseCollectable.prototype.resetFloatation = function (speed, tween) {
            if (speed === void 0) { speed = 10; }
            if (tween === void 0) { tween = true; }
            this.body.velocity.x = speed;
            if (tween)
                this.game.add.tween(this).to({ y: '+50' }, 1500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true);
        };
        BaseCollectable.prototype.collect = function (character) {
            this.playSound();
        };
        BaseCollectable.prototype.overlapWithChar = function (character) {
            if (this.game.physics.arcade.overlap(character.sprite, this)) {
                this.collect(character);
                this.kill();
                return true;
            }
            return false;
        };
        return BaseCollectable;
    })(Phaser.Sprite);
    Collectables.BaseCollectable = BaseCollectable;
    var ImproveFirePower = (function (_super) {
        __extends(ImproveFirePower, _super);
        function ImproveFirePower(game) {
            _super.call(this, game, 'bullet');
        }
        ImproveFirePower.prototype.collect = function (character) {
            if (character.firePower < 5) {
                character.firePower += 1;
                this.game.state.states.Level1.ui.infoText.showCustomText('Fire Power!');
                this.playSound();
            }
        };
        ImproveFirePower.prototype.loadAnimation = function () {
            this.animations.add('main', ['bullet1', 'bullet2'], 3, true, false);
        };
        ImproveFirePower.prototype.loadSound = function () {
            this.collectSound = this.game.add.audio('bulletCollect');
        };
        return ImproveFirePower;
    })(BaseCollectable);
    Collectables.ImproveFirePower = ImproveFirePower;
    var ImprovedShield = (function (_super) {
        __extends(ImprovedShield, _super);
        function ImprovedShield(game) {
            _super.call(this, game, 'shield');
        }
        ImprovedShield.prototype.collect = function (character) {
            if (character.shield < 3) {
                character.shield += 1;
                character.renderShield();
                this.game.state.states.Level1.ui.infoText.showCustomText('Shield On!');
                this.playSound();
            }
        };
        ImprovedShield.prototype.loadAnimation = function () {
            this.animations.add('main', ['shield1', 'shield2', 'shield3', 'shield4', 'shield5'], 4, true, false);
        };
        ImprovedShield.prototype.loadSound = function () {
            this.collectSound = this.game.add.sound('shieldCollect', 1);
        };
        return ImprovedShield;
    })(BaseCollectable);
    Collectables.ImprovedShield = ImprovedShield;
    var NukeBomb = (function (_super) {
        __extends(NukeBomb, _super);
        function NukeBomb(game) {
            _super.call(this, game, 'nuke');
        }
        NukeBomb.prototype.collect = function (character) {
            character.nukes += 1;
            this.game.state.states.Level1.ui.infoText.showCustomText('Nuke Collected!');
            this.playSound();
        };
        NukeBomb.prototype.loadAnimation = function () {
            this.animations.add('main', ['nuke1', 'nuke2', 'nuke3', 'nuke4', 'nuke5', 'nuke6'], 5, true, false);
        };
        NukeBomb.prototype.loadSound = function () {
            this.collectSound = this.game.add.audio('nukeCollect');
        };
        return NukeBomb;
    })(BaseCollectable);
    Collectables.NukeBomb = NukeBomb;
    var TimeWarp = (function (_super) {
        __extends(TimeWarp, _super);
        function TimeWarp(game) {
            _super.call(this, game, 'clock');
        }
        TimeWarp.prototype.collect = function (character) {
            character.timeWarps += 1;
            this.game.state.states.Level1.ui.infoText.showCustomText('Time Warp Collected');
            this.playSound();
        };
        TimeWarp.prototype.loadAnimation = function () {
            this.animations.add('main', ['clock1', 'clock2', 'clock3', 'clock4', 'clock5', 'clock6'], 5, true, false);
        };
        TimeWarp.prototype.loadSound = function () {
            this.collectSound = this.game.add.audio('timeWarpCollect');
        };
        return TimeWarp;
    })(BaseCollectable);
    Collectables.TimeWarp = TimeWarp;
    var Diamond = (function (_super) {
        __extends(Diamond, _super);
        function Diamond(game) {
            _super.call(this, game, 'diamond');
        }
        Diamond.prototype.collect = function (character) {
            character.coins += 10;
            this.playSound();
        };
        Diamond.prototype.loadAnimation = function () {
        };
        return Diamond;
    })(BaseCollectable);
    Collectables.Diamond = Diamond;
    var Immunity = (function (_super) {
        __extends(Immunity, _super);
        function Immunity(game) {
            _super.call(this, game, 'star');
        }
        Immunity.prototype.collect = function (character) {
            character.immunity = true;
            this.game.state.states.Level1.ui.infoText.showCustomText('Inmune!');
            this.playSound();
        };
        Immunity.prototype.loadAnimation = function () {
        };
        return Immunity;
    })(BaseCollectable);
    Collectables.Immunity = Immunity;
    var Bomb = (function (_super) {
        __extends(Bomb, _super);
        function Bomb(game) {
            _super.call(this, game, 'rocket');
        }
        Bomb.prototype.collect = function (character) {
            character.bombs += 1;
            this.game.state.states.Level1.ui.infoText.showCustomText('Rocket Collected!');
            this.playSound();
        };
        Bomb.prototype.loadAnimation = function () {
            this.animations.add('main', ['rocket1', 'rocket2'], 6, true, false);
        };
        Bomb.prototype.loadSound = function () {
            this.collectSound = this.game.add.audio('rocketCollect');
        };
        return Bomb;
    })(BaseCollectable);
    Collectables.Bomb = Bomb;
    var Lives = (function (_super) {
        __extends(Lives, _super);
        function Lives(game) {
            _super.call(this, game, 'hero1');
        }
        Lives.prototype.collect = function (character) {
            character.lives += 1;
            this.game.state.states.Level1.ui.infoText.showCustomText('1 UP');
            this.playSound();
        };
        Lives.prototype.loadAnimation = function () {
            this.animations.add('main', ['head1', 'head2', 'head3', 'head4', 'head5'], 6, true, false);
        };
        Lives.prototype.loadSound = function () {
            this.collectSound = this.game.add.audio('extraLifeCollect');
        };
        return Lives;
    })(BaseCollectable);
    Collectables.Lives = Lives;
})(Collectables || (Collectables = {}));
/**
 * Character class.
 * Wraps the logic of creating and upating a character. Should be extended from
 * Hero and Badie
 */
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../utils/Utils.ts"/>
/// <reference path="../ui/UI.ts"/>
/// <reference path="../core/Game.ts"/>
/// <reference path="CharStates.ts"/>
/// <reference path="../collectables/Collectables.ts"/>
var Superhero;
(function (Superhero) {
    (function (Facing) {
        Facing[Facing["LEFT"] = -1] = "LEFT";
        Facing[Facing["RIGHT"] = 1] = "RIGHT";
    })(Superhero.Facing || (Superhero.Facing = {}));
    var Facing = Superhero.Facing;
    var Character = (function () {
        /**
         * Constructor. Creates the Character
         * @param {Phaser.Game} game     the instance of the game to wich it will be created
         * @param {string}      assetKey The name of the asset to which the character will be created
         * @param {number}      x        Initial X coordinate of the character
         * @param {number}      y        Initial Y coordinate of the character
         */
        function Character(game, assetKey, x, y) {
            this.soundEnabled = true;
            this.fxEnabled = true;
            this.shootDelay = 200;
            this.allowFingerMargin = true;
            // Power Ups
            this.firePower = 1;
            this.nukes = 0;
            this.timeWarps = 0;
            this.immunity = false;
            this.bombs = 0;
            this.shield = 0;
            this.lives = 3;
            this.coins = 0; // 1 Diamond == 10 Coins
            this.nukeCoolDown = 0;
            this.warpCoolDown = 0;
            this.respawnDelay = 5000;
            this.bulletVelocity = 1000;
            this.allowGravity = false;
            this.comboLevel = 0;
            this.game = game;
            this.floor = this.game.height - 80;
            this._state = new Superhero.StateIdle(game, this);
            this.facing = -1 /* LEFT */;
            this.allowFingerMargin = false;
            this.onHit = new Phaser.Signal;
            this.soundEnabled = this.game.conf.ISMUSICENABLED;
            this.fxEnabled = this.game.conf.ISMUSICENABLED;
            this.initSprite(assetKey, x, y);
            this.initPhysics();
            this.addAnimations();
            this.initBullets();
            this.startChar();
            this.initAudio();
        }
        /**
         * Starts the character default behaviour
         */
        Character.prototype.startChar = function () {
            this.fuel = 2000;
            this.maxFuel = 2000;
            this.fuelTimer = this.game.time.time;
            this.bulletTimer = this.game.time.time;
            this.nukeCoolDown = this.game.time.time;
            this.warpCoolDown = this.game.time.time;
            this.sprite.play(this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["idleAnimation"]);
            this.setIdleCallback(this.flyStill);
        };
        /**
         * Initialize instance audio
         */
        Character.prototype.initAudio = function () {
            this.hitSound = this.game.add.audio(this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["hitSound"], this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["hitSoundVolume"], false);
            this.fireSound = this.game.add.audio(this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["fireSound"], this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["fireVolume"], false);
        };
        /**
         * Initializes the character sprite
         * @param {string} assetKey The name of the asset to which the character will be created
         * @param {number} x        Initial X coordinate of the character
         * @param {number} y        Initial Y coordinate of the character
         */
        Character.prototype.initSprite = function (assetKey, x, y) {
            this.sprite = this.game.add.sprite(x, y, assetKey, this.game.conf.CHARACTERSCOLLECTION[assetKey]["mainSprite"]);
            //TODO Deacrease sprite size not to use scale, or properly update boundaries
            this.sprite.anchor.setTo(this.game.conf.CHARACTERSCOLLECTION[assetKey]["anchor"]["x"], this.game.conf.CHARACTERSCOLLECTION[assetKey]["anchor"]["y"]);
            this.sprite.scale.setTo(this.game.conf.CHARACTERSCOLLECTION[assetKey]["scale"]);
            if (this.game.conf.CHARACTERSCOLLECTION[assetKey]["diesOutOfBounds"]) {
                this.sprite.checkWorldBounds = true;
                this.sprite.outOfBoundsKill = true;
            }
        };
        /**
         * Initalizes the physics of the character
         */
        Character.prototype.initPhysics = function () {
            this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
            this.sprite.body.collideWorldBounds = true;
            this.sprite.body.gravity.y = this.game.conf.PHYSICS.player.gravity.y;
            this.sprite.body.drag.x = this.game.conf.PHYSICS.player.drag;
            this.sprite.body.drag.y = this.game.conf.PHYSICS.player.drag;
        };
        /**
         * Wraps the left movement logic
         */
        Character.prototype.moveLeft = function () {
            this.sprite.body.velocity.x = -500;
        };
        /**
         * Wraps the sprint logic
         */
        Character.prototype.sprint = function () {
            this.sprite.play('fly');
            this.sprite.body.velocity.x = 800;
        };
        /**
         * Wraps the descend logic
         */
        Character.prototype.descend = function () {
            if (this.sprite.y < this.floor - this.sprite.height)
                this.sprite.y += 5;
        };
        /**
         * Wraps the climb logic
         */
        Character.prototype.climb = function () {
            this.sprite.body.velocity.y = -500;
        };
        /**
         * Wraps the jump logic
         */
        Character.prototype.jump = function () {
            if (this.sprite.alive && this.sprite.body.touching.down) {
                this.sprite.body.velocity.y = -650;
            }
        };
        /**
         * Wraps the mid air flight logic
         */
        Character.prototype.flyStill = function () {
            if (this.sprite.animations.currentAnim.isFinished) {
                this.sprite.play('flystill');
            }
        };
        /**
         * Wraps the run logic
         */
        Character.prototype.run = function () {
            if (this.sprite.animations.currentAnim.isFinished) {
                this.sprite.play('run');
            }
        };
        Character.prototype.move = function (speed) {
            if (this.allowFingerMargin && (this.sprite.x <= this.game.width / 2 && speed.x < 0))
                speed.x = 0;
            this.sprite.body.velocity.x = speed.x * this.game.time.slowMotion;
            if (this.fuel)
                this.sprite.body.velocity.y = speed.y * this.game.time.slowMotion;
        };
        /**
         * Wraps the stop logic
         */
        Character.prototype.stop = function () {
            this.sprite.animations.play('stop').onComplete.add(function () {
                this.sprite.animations.play('flystill');
            }, this);
        };
        Character.prototype.shootTimeUp = function () {
            var bulletTimerVal = this.bulletTimer;
            if (sh.state.getCurrentState().key != "Intro" && this.sprite.key != "hero1") {
                if (sh.state.states.Level1.hero.timewarpActive) {
                    bulletTimerVal = bulletTimerVal * 2;
                }
            }
            var elapsedTime = this.game.time.elapsedSince(bulletTimerVal);
            return !(elapsedTime < this.shootDelay);
        };
        Character.prototype.okToShoot = function () {
            if (!this.sprite.alive)
                return false;
            if ((this.sprite.animations.currentAnim.name == 'shoot') && !this.sprite.animations.currentAnim.isFinished)
                return false;
            return true;
        };
        Character.prototype.canShoot = function () {
            return this.shootTimeUp() && this.okToShoot();
        };
        /**
         * Wraps the fire logic. Check if there is a "dead" bullet. If so, reset
         * its position and sendit fo fly
         */
        Character.prototype.fire = function () {
            //Thou shalt only shoot if there is no shooting in progress
            ////Check for shootRate
            //var elapsedTime = this.game.time.elapsedSince(this.bulletTimer);
            //if (elapsedTime < this.shootDelay) return;
            if (!this.canShoot())
                return;
            this.sprite.animations.play('shoot');
            for (var i = 0; i < this.firePower; i++) {
                //Get the first bullet that has gone offscreen
                var bullet = this.bullets.getFirstDead();
                //If there is none (all are still flying) create new one.
                if (!bullet) {
                    bullet = this.createNewBullet();
                }
                bullet.anchor.setTo(this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["anchor"]["x"], this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["anchor"]["y"]);
                // Fire sfx
                this.playFireSound();
                bullet.reset(this.sprite.x + (this.facing * 40), this.sprite.y + (10 * i + 1));
                bullet.checkWorldBounds = true;
                bullet.outOfBoundsKill = true;
                bullet.body.velocity.x = this.bulletVelocity * this.game.time.slowMotion;
                bullet.body.allowGravity = false;
                bullet.scale.setTo(0.4);
                //bullet.scale.setTo((<Superhero.Game> this.game).conf.WORLD.sprite_scaling);
                this.playFireSound();
            }
            //Reset the timer
            this.resetFireTimer();
        };
        /**
         * Resets the bullet timer
         */
        Character.prototype.resetFireTimer = function () {
            this.bulletTimer = this.game.time.time;
        };
        /**
         * Adds the animations to the character
         */
        Character.prototype.addAnimations = function () {
            var newCharAnims = this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["animations"];
            for (var key in newCharAnims) {
                this.sprite.animations.add(key, newCharAnims[key]["frames"], newCharAnims[key]["frameRate"], newCharAnims[key]["loop"], newCharAnims[key]["useNumericIndex"]);
            }
            ;
            this.sprite.events.onAnimationComplete.add(function () {
                if (this.isAlive) {
                    this.sprite.animations.stop();
                    this.idleCallback();
                }
            }, this);
        };
        /**
         * Creates bullets group and enable physics
         */
        Character.prototype.initBullets = function () {
            // Create a bullet group with Arcade physics
            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            this.firePower = this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["firePower"];
            // The bullets are "dead" by default, so they are not visible in the game
            this.bullets.createMultiple(this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["qty"], this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["key"], this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["frame"]);
            this.rockets = this.game.add.group();
            this.rockets.enableBody = true;
            this.rockets.createMultiple(4, 'bullets', 'bullet2');
        };
        /**
         * If it is flying, then decrease the fuel, if it is on the ground, slowly increase the fuel
         */
        Character.prototype.updateFuel = function () {
            var elapsedTime = this.game.time.elapsedSecondsSince(this.fuelTimer);
            if (elapsedTime > 0.02) {
                this.fuelTimer = this.game.time.time;
                if (this.sprite.body.touching.down) {
                    if (this.fuel < this.maxFuel) {
                        this.fuel += 1;
                    }
                }
                else {
                    if (this.fuel > 5) {
                        this.fuel -= 5;
                    }
                    else {
                        this.fuel = 0;
                    }
                }
            }
        };
        Character.prototype.unShield = function () {
            if (this.sprite.key == 'hero1') {
                this.sprite.removeChildAt(this.shield);
            }
        };
        /**
         * Update method. Here should be all the logic related to the character's game loop
         */
        Character.prototype.update = function () {
        };
        /**
         * Sets the bullet velocity to all subsequent shots
         * @param {number} n the new value to the bullet velocity
         */
        Character.prototype.setBulletVelocity = function (n) {
            this.bulletVelocity = n * this.facing;
        };
        /**
         * Sets collitions of the character with a group
         * @param {Phaser.Group} group Group upon wich the character should collide
         */
        Character.prototype.collideWithGroup = function (group) {
            this.game.physics.arcade.collide(group, this.sprite, null, null, this);
        };
        /**
         * Sets collection of the character with a group
         * @param {Phaser.Group} group Group that the character will collect
         */
        Character.prototype.collectsGroup = function (group) {
            this.game.physics.arcade.collide(group, this.sprite, this.collect, null, this);
        };
        /**
         * Sets the collitions of the character with an object
         * @param {Phaser.Sprite} object Object upon which the character sould collide
         */
        Character.prototype.collideWithObject = function (object) {
            this.game.physics.arcade.collide(object, this.sprite, null, null, this);
        };
        /**
         * Configures the Character to die upon colliding with a group
         * @param {Phaser.Group} group Group that will make the character die
         */
        Character.prototype.diesWithGroup = function (group) {
            this.game.physics.arcade.overlap(group, this.sprite, this.die, null, this);
        };
        /**
         * Configures the Character to die upon colliding with an object
         * @param {Phaser.Sprite} object Object that will make the character die
         */
        Character.prototype.diesWithObject = function (object) {
            this.game.physics.arcade.overlap(object, this.sprite, this.die, null, this);
        };
        /**
         * Callback method when the character collides with a deadly object
         * @param {Phaser.Sprite} char   An instance of the character
         * @param {any}           object An instance of the collided object
         */
        Character.prototype.die = function (char, object) {
            // TODO: implement lives and different animations for enemies
            if (this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["isImmortal"]) {
                return false;
            }
            var elapsedTime = this.game.time.elapsedSince(this.dieTimer);
            if (elapsedTime < this.respawnDelay)
                return false;
            this.dieTimer = this.game.time.time;
            // SFX
            this.playGetHitSound();
            // Ugly workaround
            // lol!
            if (object) {
                if (object.frameName != "blueBeam") {
                    object.kill();
                }
                // Rocket fix
                this.checkRocketCollision(object);
            }
            if (this.sprite.key == "hero1") {
                if (this.comboLevel > 0)
                    this.game.state.states.Level1.ui.infoText.showComboText("Combo Lost!");
                this.comboLevel = 0;
            }
            // Shields
            if (this.shield > 0) {
                this.shield -= 1;
                this.flickerSprite(0xFF0000);
                this.unShield();
                this.onHit.dispatch();
                //window.navigator.vibrate(100);
                return false;
            }
            if (this.lives > 1) {
                this.lives -= 1;
                this.onHit.dispatch();
                this.dieReset();
                //window.navigator.vibrate([300,300,300,300]);
                return false;
            }
            this.lives -= 1;
            char.alive = false;
            this.deadSince = this.game.time.time;
            // Update combo using enemy sields
            this.updateComboByEnemy();
            if (this.bullets)
                this.bullets.forEachAlive(function (b) {
                    b.kill();
                }, this);
            if (this.rockets)
                this.rockets.forEachAlive(function (r) {
                    r.kill();
                }, this);
            char.animations.play('takehit', 4, false, true);
            return true;
        };
        Character.prototype.dieReset = function () {
            this.sprite.reset(100, this.game.world.centerY);
            var flickerRepeats = Math.floor(this.respawnDelay / 550);
            Superhero.Utils.interval(this.flickerSprite.bind(this), 400, flickerRepeats);
            this.firePower = 1;
        };
        Character.prototype.updateComboByEnemy = function () {
            if (sh.state.getCurrentState().key != "Intro") {
                if (this.sprite.key != "smallMissileEnemy" && this.sprite.key != "hero1") {
                    var charShields = this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["shields"];
                    if (charShields == 0)
                        charShields = 1;
                    this.game.state.states.Level1.hero.updateCombo(charShields / 10);
                    this.game.state.states.Level1.ui.scoreUp(charShields * 50);
                }
            }
        };
        Character.prototype.flickerSprite = function (color) {
            if (color === void 0) { color = 0xFF0000; }
            this.sprite.tint = color;
            this.game.time.events.add(150, function () {
                this.sprite.tint = 0xFFFFFF;
            }, this);
        };
        /**
         * Callback method when the character collides with a collectable object
         * @param {Phaser.Sprite} char   An instance of the character
         * @param {any}           object An instance of the collided object
         */
        Character.prototype.collect = function (char, object) {
            object.collect(this);
            object.kill();
        };
        /**
         * Creates new bullet
         */
        Character.prototype.createNewBullet = function (key, frame) {
            var keyBullet;
            var frameBullet;
            if (key && frame) {
                keyBullet = key;
                frameBullet = frame;
            }
            else {
                keyBullet = this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["key"];
                frameBullet = this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["frame"];
            }
            return this.bullets.create(-200, -200, keyBullet, frameBullet);
        };
        Character.prototype.checkRocketCollision = function (object) {
            if (this.shield > 0) {
                if (object.frameName == "bullet2") {
                    this.shield = 0;
                }
            }
        };
        Character.prototype.setRespawnDelay = function (delay) {
            this.respawnDelay = delay;
        };
        Character.prototype.canRespawn = function () {
            var elapsedTime = this.game.time.elapsedSince(this.deadSince);
            if (elapsedTime > this.respawnDelay) {
                return true;
            }
            return false;
        };
        Character.prototype.renderShield = function () {
            var shields = ['shield1', 'shield2', 'shield3'];
            var shield = this.game.add.sprite(20, 95, 'shields', shields[this.shield - 1]);
            this.game.physics.arcade.enable(shield);
            shield.scale.setTo(2.5, 2.5);
            shield.anchor.setTo(0.5, 0.5);
            shield.rotation += Phaser.Math.degToRad(90);
            this.sprite.addChild(shield);
        };
        /**
         * Each state has a different idle state (in the intro the character runs on idle, on the main level the character
         flies still. So the State can set the idle state to whichever fits. Note that this does not alter the FSM. It only alters
         the function that is called upon finishing an animation.
         * @param listener the Function Handler
         * @param listenerContext the Context with which it should be called
         */
        Character.prototype.setIdleCallback = function (listener, listenerContext) {
            if (listenerContext === void 0) { listenerContext = this; }
            this.idleCallback = listener.bind(listenerContext);
        };
        Character.prototype.playGetHitSound = function () {
            this.soundEnabled = this.game.conf.ISMUSICENABLED;
            if (this.soundEnabled) {
                this.hitSound.play();
            }
        };
        Character.prototype.playFireSound = function () {
            this.soundEnabled = this.game.conf.ISMUSICENABLED;
            if (this.soundEnabled) {
                this.fireSound.play();
            }
        };
        return Character;
    })();
    Superhero.Character = Character;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>
/// <reference path="../plugins/GamePad.ts"/>
var Superhero;
(function (Superhero) {
    var Hero = (function (_super) {
        __extends(Hero, _super);
        function Hero(game, spriteKey) {
            var sptK;
            if (spriteKey) {
                sptK = spriteKey;
            }
            else {
                sptK = "hero1";
            }
            _super.call(this, game, sptK, game.world.centerX - 200, game.world.centerY);
            this.facing = 1 /* RIGHT */;
            this.shootDelay = 500;
            this.timewarpActive = false;
            this.setBulletVelocity(1000);
        }
        Hero.prototype.update = function () {
            _super.prototype.update.call(this);
            var newState = this._state.update();
            // If the update returned a different state then
            // we must exit the previous state, start the new one and assign the new one
            if (newState !== this._state) {
                this._state.exitState();
                newState.enterState();
                this._state = newState;
            }
        };
        Hero.prototype.updateCombo = function (amount) {
            var prevCombo = this.comboLevel;
            this.comboLevel += amount;
            this.game.state.states.Level1.ui.scoreUp(50);
            if (Math.floor(this.comboLevel) > Math.floor(prevCombo)) {
                this.game.state.states.Level1.ui.infoText.showComboText(this.comboLevel);
            }
        };
        Hero.prototype.fireWarp = function () {
            if (this.timeWarps <= 0 || !this.sprite.alive)
                return;
            this.timewarpActive = true;
            this.game.add.tween(this.game.time).to({ slowMotion: 5.0 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false).onComplete.add(function () {
                this.sprite.body.drag.x *= 3 * this.game.time.slowMotion;
                this.sprite.body.drag.y *= 3 * this.game.time.slowMotion;
            }, this);
            if (this.game.conf.ISMUSICENABLED) {
                this.game.add.tween(this.game.state.states.Level1.theme).to({ volume: 0.05 }, 300, Phaser.Easing.Linear.None, true, 0, 0, false);
            }
            this.game.time.events.add(8000, function () {
                this.sprite.body.drag.x /= 3 * this.game.time.slowMotion;
                this.sprite.body.drag.y /= 3 * this.game.time.slowMotion;
                this.game.add.tween(this.game.time).to({ slowMotion: 1.0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
                if (this.game.conf.ISMUSICENABLED) {
                    this.game.add.tween(this.game.state.states.Level1.theme).to({ volume: 0.5 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
                }
            }, this);
            this.game.time.events.add(6000, function () {
                if (this.fxEnabled)
                    this.warpEnd.play();
                this.game.time.events.add(2000, function () {
                    this.timewarpActive = false;
                }, this);
            }, this);
            this.timeWarps -= 1;
            if (this.fxEnabled)
                this.fireWarpSound.play();
        };
        /**
         * Wraps the fire logic. Check if there is a "dead" bullet. If so, reset
         * its position and sendit fo fly
         */
        Hero.prototype.fireRocket = function () {
            if (this.bombs <= 0 || !this.canShoot())
                return;
            this.sprite.animations.play('shoot');
            //Get the first bullet that has gone offscreen
            var rocket = this.rockets.getFirstDead();
            //If there is none (all are still flying) create new one.
            if (!rocket)
                rocket = this.rockets.create(-10, -10, 'bullets', 'bullet2');
            rocket.anchor.setTo(0.5, 1);
            rocket.reset(this.sprite.x + (this.facing * 40), this.sprite.y + this.sprite.height / 2);
            rocket.checkWorldBounds = true;
            rocket.outOfBoundsKill = true;
            rocket.body.velocity.x = this.bulletVelocity;
            rocket.body.allowGravity = false;
            rocket.scale.setTo(0.6);
            //rocket.scale.setTo((<Superhero.Game> this.game).conf.WORLD.sprite_scaling);
            //Reset the timer
            this.bulletTimer = this.game.time.time;
            this.bombs -= 1;
            if (this.fxEnabled)
                this.fireRocketSound.play();
        };
        /**
         * Wraps the fire logic. Check if there is a "dead" bullet. If so, reset
         * its position and sendit fo fly
         */
        Hero.prototype.fireNuke = function () {
            if (this.nukes <= 0 || !this.sprite.alive)
                return;
            //var coolDown = this.game.time.elapsedSecondsSince(this.nukeCoolDown);
            //if (coolDown < 30) return;
            //this.nukeCoolDown = this.game.time.time;
            var graphics = this.game.add.graphics(0, 0);
            graphics.lineStyle(0);
            graphics.beginFill(0xFFFFFF, 1);
            var rect = graphics.drawRect(0, 0, this.game.width, this.game.height);
            var nukeTween = this.game.add.tween(rect);
            nukeTween.to({ alpha: 0 }, 1500);
            nukeTween.onComplete.add(function () {
                graphics.destroy();
            }, this);
            nukeTween.start();
            this.game.state.states.Level1.obstacleManager.killAll();
            this.game.state.states.Level1.enemyManager.killAll();
            //Reset the timer
            this.bulletTimer = this.game.time.time;
            this.nukes -= 1;
            if (this.fxEnabled)
                this.fireNukeSound.play();
        };
        Hero.prototype.die = function (char, object) {
            var dead = _super.prototype.die.call(this, char, object);
            if (!dead) {
                this.fxEnabled = this.game.conf.ISMUSICENABLED;
                if (this.fxEnabled)
                    this.takeHitSound.play();
            }
            if (dead) {
                var snd = this.game.add.audio('heroDie', 0.8, false);
                var state = this.game.state.getCurrentState();
                snd.play();
            }
            return dead;
        };
        /**
         * Initialize instance audio
         */
        Hero.prototype.initAudio = function () {
            this.hitSound = this.game.add.audio("enemyHit", 0.5, false);
            this.fireSound = this.game.add.audio(this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["fireSound"], this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["fireVolume"], false);
            this.fireNukeSound = this.game.add.audio('heroFireNuke', 0.9);
            this.fireWarpSound = this.game.add.audio('heroFireWarp', 0.8);
            this.fireRocketSound = this.game.add.audio('heroFireRocket', 0.2);
            this.warpEnd = this.game.add.audio('heroWarpEnd', 0.8);
            this.takeHitSound = this.game.add.audio('heroGetHit', 0.8);
        };
        return Hero;
    })(Superhero.Character);
    Superhero.Hero = Hero;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>
var Superhero;
(function (Superhero) {
    /**
     * Interface to set enemies tween range
     */
    (function (spawnEnemyPosition) {
        spawnEnemyPosition[spawnEnemyPosition["TOP"] = 150] = "TOP";
        spawnEnemyPosition[spawnEnemyPosition["DOWN"] = -150] = "DOWN";
    })(Superhero.spawnEnemyPosition || (Superhero.spawnEnemyPosition = {}));
    var spawnEnemyPosition = Superhero.spawnEnemyPosition;
    /**
     * Enemy base class
     */
    var EnemyBase = (function (_super) {
        __extends(EnemyBase, _super);
        function EnemyBase(game, enemyChar) {
            _super.call(this, game, enemyChar.assetsKey, game.width - enemyChar.spawnLocation.x, enemyChar.spawnLocation.y);
            this.isPatrolling = false;
            this.fireEnabled = true;
            this.dropsSmoke = false;
            // Set custom properties
            this.setCustomEnemyProperties(enemyChar);
            this.lives = 1;
        }
        EnemyBase.prototype.update = function () {
            _super.prototype.update.call(this);
            var newState = this._state.update();
            // If the update returned a different state then
            // we must exit the previous state, start the new one and assign the new one
            if (newState !== this._state) {
                this._state.exitState();
                newState.enterState();
                this._state = newState;
            }
        };
        /**
         * Set enemy custom properties
        **/
        EnemyBase.prototype.setCustomEnemyProperties = function (enemyChar) {
            // Common properties
            this.firePower = enemyChar.firePower;
            this.spawnPoint = enemyChar.spawnPoint;
            this.facing = enemyChar.facing;
            this.setBulletVelocity(enemyChar.bulletVelocity);
            this.shootDelay = enemyChar.shootDelay;
            this.deadSince = enemyChar.deadSince;
            this.fireEnabled = enemyChar.fireEnabled;
            this.shield = enemyChar.shields;
            this.sprite.rotation = 0;
            if (enemyChar.respawnDelay) {
                this.respawnDelay = enemyChar.respawnDelay;
            }
            this.dropsSmoke = enemyChar.dropsSmoke;
            this.soundEnabled = enemyChar.soundEnabled;
            this.resetFireTimer();
            // State
            this._state = new Superhero.StateEnemyHostile(this.game, this);
            // Patrol
            if (enemyChar.defaultState == 1 /* PATROL */) {
                this.isPatrolling = true;
                this._state.patrol(enemyChar.spawnPoint);
            }
            if (enemyChar.assetsKey == "smallMissileEnemy") {
                this._state.startWarning();
            }
            // Smoke emitter
            if (this.dropsSmoke) {
                this.initSmokeEmitter();
            }
            this.sprite.animations.play(this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["idleAnimation"]);
        };
        /**
         * Initalizes the physics of the character
         */
        EnemyBase.prototype.initPhysics = function () {
            _super.prototype.initPhysics.call(this);
            this.sprite.body.drag.x = 0;
            this.sprite.body.collideWorldBounds = false;
            this.sprite.body.checkWorldBounds = true;
        };
        /**
         * Wraps the fire logic. Check if there is a "dead" bullet. If so, reset
         * its position and sendit fo fly
         */
        EnemyBase.prototype.fire = function () {
            if (this.fireEnabled) {
                //Thou shalt only shoot if there is no shooting in progress
                if (this.canShoot()) {
                    //Check for shootRate
                    var elapsedTime = this.game.time.elapsedSince(this.bulletTimer);
                    if (elapsedTime < this.shootDelay)
                        return;
                    this.sprite.animations.play('shoot', this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["shootAnimationFrames"]);
                    for (var i = 0; i < this.firePower; i++) {
                        //Get the first bullet that has gone offscreen
                        var bullet = this.bullets.getFirstDead();
                        //If there is none (all are still flying) create new one.
                        if (!bullet) {
                            bullet = this.createNewBullet();
                        }
                        bullet.anchor.setTo(this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["anchor"]["x"], this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["anchor"]["y"]);
                        // Fire sfx
                        this.playFireSound();
                        bullet.reset(this.sprite.x + (this.facing * 40), this.sprite.y + (10 * i + 1));
                        bullet.angle = 180;
                        bullet.checkWorldBounds = true;
                        bullet.outOfBoundsKill = true;
                        bullet.body.velocity.x = this.bulletVelocity;
                        bullet.body.allowGravity = this.allowGravity;
                        bullet.scale.setTo(this.game.conf.WORLD.sprite_scaling);
                    }
                    //Reset the timer
                    this.bulletTimer = this.game.time.time;
                }
            }
        };
        EnemyBase.prototype.initSmokeEmitter = function () {
            this.smokeEmitter = this.game.add.emitter();
            this.smokeEmitter.maxParticles = 13;
            this.sprite.addChild(this.smokeEmitter);
            this.smokeEmitter.makeParticles('smoke');
            this.smokeEmitter.setXSpeed(0, -50);
            this.smokeEmitter.setYSpeed(0, 0);
            this.smokeEmitter.setRotation(0, 0);
            this.smokeEmitter.setAlpha(0.1, 1, 3000);
            this.smokeEmitter.setScale(0.8, 1.5, 0.8, 1.5, 1000, Phaser.Easing.Quintic.Out);
            this.smokeEmitter.gravity = -30;
            this.smokeEmitter.y = 45;
            this.smokeEmitter.x = 36;
        };
        EnemyBase.prototype.startSmokeEmitter = function () {
            this.smokeEmitter.start(false, 2000, 100);
            this.smokeEmitter.on = true;
        };
        EnemyBase.prototype.stopSmokeEmitter = function () {
            this.smokeEmitter.on = false;
        };
        return EnemyBase;
    })(Superhero.Character);
    Superhero.EnemyBase = EnemyBase;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Character.ts"/>
var Superhero;
(function (Superhero) {
    /**
     * Manage enemies inside level
     */
    var EnemyManager = (function () {
        function EnemyManager(game, levelID) {
            this.multiplier = 0;
            this.game = game;
            this.currentLevel = levelID;
            this.startTimer();
            this.enemies = [];
            this.enemiesAlive = [];
            this.createLevelEnemies();
        }
        EnemyManager.prototype.killAll = function () {
            for (var i = 0; i < this.enemiesAlive.length; i++) {
                this.enemiesAlive[i].shield = 0;
                this.enemiesAlive[i].die(this.enemiesAlive[i].sprite);
            }
        };
        /**
        * Enemies Timer
        */
        EnemyManager.prototype.startTimer = function () {
            // 20 secs per update add multiplier 0.1
            this.enemiesTimer = this.game.time.create(false);
            this.enemiesTimer.start();
            this.enemiesTimer.loop(this.game.conf.ENEMIES.respawnLapse, this.updateMultiplier, this);
        };
        /**
         * Update multiplier values
         */
        EnemyManager.prototype.updateMultiplier = function () {
            this.multiplier += this.game.conf.ENEMIES.multiplier;
            this.tryToSpawnEnemy();
        };
        /**
         * Spawn random enemy
         */
        EnemyManager.prototype.spawnRandomEnemy = function () {
            var enemySpawnPoint = this.getRandomEnemySpawnPosition(true);
            var enemyDefaultState = this.getRandomEnemyState();
            var assetsKey = this.getRandomEnemyAsset();
            //TODO: implement
            if (assetsKey === "tentabot01") {
                enemyDefaultState = 0 /* STEADY */;
            }
            else if (assetsKey == "miniBoss") {
                enemyDefaultState = 1 /* PATROL */;
                enemySpawnPoint = -150 /* DOWN */;
            }
            else if (assetsKey == "smallMissileEnemy") {
                enemyDefaultState = 0 /* STEADY */;
            }
            var newEnemy = {
                assetsKey: assetsKey,
                facing: -1 /* LEFT */,
                bulletVelocity: this.getBulletSpeed(),
                spawnLocation: this.getSpawnCoordinates(enemyDefaultState, enemySpawnPoint),
                firePower: this.getFirePower(assetsKey),
                shootDelay: this.getShootDelay(assetsKey),
                defaultState: enemyDefaultState,
                spawnPoint: enemySpawnPoint,
                fireEnabled: true,
                shields: this.game.conf.CHARACTERSCOLLECTION[assetsKey]["shields"],
                respawnDelay: 1000,
                soundEnabled: true,
                dropsSmoke: this.game.conf.CHARACTERSCOLLECTION[assetsKey]["dropsSmoke"]
            };
            // TODO: implement
            if (assetsKey === "tentabot01") {
                if (newEnemy.spawnPoint == 150 /* TOP */) {
                    newEnemy.spawnLocation.y -= 100;
                }
                else {
                    newEnemy.spawnLocation.y -= 25;
                }
            }
            //this.enemies.push(new Superhero.EnemyBase(this.game, newEnemy));
            var spawnEnemy = this.getFirstEnemyDead(newEnemy.assetsKey);
            if (spawnEnemy) {
                // Fix x position
                newEnemy.spawnLocation.x = this.game.width - newEnemy.spawnLocation.x;
                spawnEnemy._state.stopPatrol();
                if (!spawnEnemy.sprite.alive) {
                    spawnEnemy.sprite.reset(newEnemy.spawnLocation.x, newEnemy.spawnLocation.y);
                    spawnEnemy.setCustomEnemyProperties(newEnemy);
                    this.enemiesAlive.push(spawnEnemy);
                }
            }
        };
        EnemyManager.prototype.getFirstEnemyDead = function (key) {
            for (var i = 0; i < this.enemies.length; i++) {
                if (this.enemies[i].sprite.key === key && !this.enemies[i].sprite.alive && this.enemies[i].canRespawn())
                    return this.enemies[i];
            }
            return null;
        };
        EnemyManager.prototype.getShootDelay = function (enemyAssetKey) {
            var shootDelay = this.game.conf.ENEMIES.shootDelay / (1 + this.multiplier);
            if (this.game.conf.CHARACTERSCOLLECTION[enemyAssetKey]["minShootDelay"] > shootDelay) {
                shootDelay = this.game.conf.CHARACTERSCOLLECTION[enemyAssetKey]["minShootDelay"];
            }
            return shootDelay;
        };
        EnemyManager.prototype.getBulletSpeed = function () {
            var bulletSpeed = this.game.conf.ENEMIES.bulletSpeed * (1 + this.multiplier);
            if (bulletSpeed > this.game.conf.ENEMIES.maxBulletSpeed) {
                bulletSpeed = this.game.conf.ENEMIES.maxBulletSpeed;
            }
            return bulletSpeed;
        };
        EnemyManager.prototype.getRandomEnemyAsset = function () {
            //var newEnemyAsset = this.game.rnd.integerInRange(0, this.enemiesForThisLevel.length - 1);
            var newEnemyAsset = this.game.rnd.integerInRange(0, this.enemiesAvailableToRespawn.length - 1);
            return this.enemiesAvailableToRespawn[newEnemyAsset];
        };
        EnemyManager.prototype.getFirePower = function (assetKey) {
            return this.game.conf.CHARACTERSCOLLECTION[assetKey]["firePower"];
        };
        EnemyManager.prototype.getSpawnCoordinates = function (enemyDefaultState, enemySpawnPoint) {
            var spawnCoordinates;
            if (enemyDefaultState === 1 /* PATROL */) {
                if (enemySpawnPoint === 150 /* TOP */) {
                    spawnCoordinates = { x: this.game.conf.ENEMIES.spawnCoordinates.patrol.top.x, y: 20 };
                }
                else {
                    // TODO: implement sprite height instead of hardcoded
                    spawnCoordinates = { x: this.game.conf.ENEMIES.spawnCoordinates.patrol.down.x, y: this.game.height - 70 };
                }
            }
            else {
                if (enemySpawnPoint === 150 /* TOP */) {
                    spawnCoordinates = { x: this.game.conf.ENEMIES.spawnCoordinates.steady.top.x, y: this.game.height / 3 };
                }
                else {
                    // TODO: implement sprite height instead of hardcoded
                    spawnCoordinates = { x: this.game.conf.ENEMIES.spawnCoordinates.steady.down.x, y: (this.game.height / 3) * 2 /*this.game.world.height - 270*/ };
                }
            }
            return spawnCoordinates;
        };
        EnemyManager.prototype.getRandomEnemyState = function () {
            return this.game.rnd.integerInRange(0, 1);
        };
        EnemyManager.prototype.getRandomEnemySpawnPosition = function (forEnemiesAlive) {
            var returnPosition;
            var enemiesValues;
            if (forEnemiesAlive) {
                enemiesValues = this.enemiesAlive;
            }
            else {
                enemiesValues = this.enemies;
            }
            if (enemiesValues.length == 0) {
                var rndInt = this.game.rnd.integerInRange(0, 1);
                if (rndInt == 0) {
                    returnPosition = 150 /* TOP */;
                }
                else {
                    returnPosition = -150 /* DOWN */;
                }
            }
            else {
                if (enemiesValues[0].spawnPoint == 150 /* TOP */) {
                    returnPosition = -150 /* DOWN */;
                }
                else {
                    returnPosition = 150 /* TOP */;
                }
            }
            return returnPosition;
        };
        /**
         * Initialize enemies for the current state
         * @param assetKey
         */
        EnemyManager.prototype.createLevelEnemies = function () {
            var _this = this;
            // TODO: improve performance or implement level preloader
            this.enemiesForThisLevel = this.game.conf.ENEMIES.levels[this.currentLevel];
            // Initialize first enemy available to respawn
            this.enemiesAvailableToRespawn = [];
            // Create enemies available to respawn timer
            this.enemiesAvailableToRespawnTimer = this.game.time.create(true);
            this.enemiesForThisLevel.forEach(function (enemyAssetKey) {
                var newEnemy = _this.getInitDefaultEnemyProperties(enemyAssetKey);
                // Timer for enemies to be available
                _this.enemiesAvailableToRespawnTimer.add(_this.game.conf.CHARACTERSCOLLECTION[enemyAssetKey]["availableSince"], _this.appendEnemyAvailalbeToRespawn, _this, enemyAssetKey);
                for (var i = 0; i < 2; i++) {
                    var spawnedNewEnemy = _this.spawnEnemy(newEnemy);
                    spawnedNewEnemy.sprite.kill();
                    spawnedNewEnemy.sprite.events.onKilled.add(function (s) {
                        this.enemiesTimer.stop();
                        this.enemiesTimer.start();
                        for (var i = 0; i < this.enemiesAlive.length; i++) {
                            if (this.enemiesAlive[i].sprite === s) {
                                var index = this.enemiesAlive.indexOf(this.enemiesAlive[i], 0);
                                if (index != undefined) {
                                    this.enemiesAlive.splice(index, 1);
                                }
                            }
                        }
                        this.enemiesTimer.loop(this.game.conf.ENEMIES.respawnLapse, this.updateMultiplier, this);
                    }, _this);
                    _this.enemies.push(spawnedNewEnemy);
                }
            });
            this.enemiesAvailableToRespawnTimer.start();
        };
        EnemyManager.prototype.appendEnemyAvailalbeToRespawn = function (assetKey) {
            this.enemiesAvailableToRespawn.push(assetKey);
        };
        EnemyManager.prototype.spawnEnemy = function (newEnemy) {
            // TODO: improve this...
            if (newEnemy.assetsKey === "tentabot01") {
                return new Superhero.TentacleBot(this.game, newEnemy);
            }
            else if (newEnemy.assetsKey === "twoHandedWeapon") {
                return new Superhero.TwoHandedEnemy(this.game, newEnemy);
            }
            else if (newEnemy.assetsKey === "miniBoss") {
                return new Superhero.MiniBoss(this.game, newEnemy);
            }
            else if (newEnemy.assetsKey === "smallMissileEnemy") {
                return new Superhero.SmallMissileEnemy(this.game, newEnemy);
            }
            else {
                return new Superhero.EnemyBase(this.game, newEnemy);
            }
        };
        /**
         * Get default values for initializing enemies
         * @param assetKey
         * @returns {IEnemy}
         */
        EnemyManager.prototype.getInitDefaultEnemyProperties = function (assetKey) {
            var newEnemy = {
                assetsKey: assetKey,
                facing: -1 /* LEFT */,
                bulletVelocity: this.game.conf.ENEMIES.bulletSpeed,
                // TODO: check if it's ok to spawn the enemy outside the world bounds this way
                spawnLocation: { x: this.game.width - 200, y: this.game.height - 200 },
                firePower: this.getFirePower(assetKey),
                shootDelay: this.game.conf.ENEMIES.shootDelay,
                defaultState: 0 /* STEADY */,
                spawnPoint: this.getRandomEnemySpawnPosition(false),
                deadSince: this.game.time.time,
                soundEnabled: false,
                dropsSmoke: false
            };
            return newEnemy;
        };
        /**
         * Call enemies update
         */
        EnemyManager.prototype.update = function () {
            this.enemies.forEach(function (enmy) { return enmy.update(); });
        };
        /**
         * Check if the new enemy can be spawned
         */
        EnemyManager.prototype.tryToSpawnEnemy = function () {
            if (this.currentLevel == "level1") {
                if (this.totalEnemiesAlive() < 2) {
                    this.spawnRandomEnemy();
                }
            }
            else {
            }
        };
        /**
         * Gets the number of enemies on the current stage
         */
        EnemyManager.prototype.totalEnemiesAlive = function () {
            return this.enemiesAlive.length;
        };
        /*
         * Spawns new enemy on the given coordinates of the given type
         * If there are not any properties random+json default values are loaded
         *
         */
        EnemyManager.prototype.spawnCustomEnemy = function (assetsKey) {
            var enemyDefaultState = 0 /* STEADY */;
            var enemySpawnPoint = 150 /* TOP */;
            var newEnemy = {
                assetsKey: assetsKey,
                facing: -1 /* LEFT */,
                bulletVelocity: this.getBulletSpeed(),
                spawnLocation: this.getSpawnCoordinates(enemyDefaultState, enemySpawnPoint),
                firePower: this.getFirePower(assetsKey),
                shootDelay: this.getShootDelay(assetsKey),
                defaultState: enemyDefaultState,
                spawnPoint: enemySpawnPoint,
                fireEnabled: false,
                shields: this.game.conf.CHARACTERSCOLLECTION[assetsKey]["shields"],
                respawnDelay: 1000,
                soundEnabled: true,
                dropsSmoke: this.game.conf.CHARACTERSCOLLECTION[assetsKey]["dropsSmoke"]
            };
            var spawnEnemy = this.getFirstEnemyDead(newEnemy.assetsKey);
            if (spawnEnemy) {
                // Fix x position
                newEnemy.spawnLocation.x = this.game.width - newEnemy.spawnLocation.x;
                if (assetsKey == "twoHandedWeapon") {
                    newEnemy.spawnLocation.y = this.game.height - 250;
                }
                if (!spawnEnemy.sprite.alive) {
                    spawnEnemy.sprite.reset(newEnemy.spawnLocation.x, newEnemy.spawnLocation.y);
                    spawnEnemy.setCustomEnemyProperties(newEnemy);
                    this.enemiesAlive.push(spawnEnemy);
                }
            }
        };
        return EnemyManager;
    })();
    Superhero.EnemyManager = EnemyManager;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="EnemyBase.ts"/>
/// <reference path="Character.ts"/>
var Superhero;
(function (Superhero) {
    /**
     * TentacleBot base class
     */
    var TentacleBot = (function (_super) {
        __extends(TentacleBot, _super);
        function TentacleBot(game, enemyChar) {
            _super.call(this, game, enemyChar);
            this.missilesLaunched = false;
            this.missiles = [];
            this.addAnimations();
            this.initMisslesPhysics();
            this.initTimer();
        }
        TentacleBot.prototype.initTimer = function () {
            this.missilesTimer = this.game.time.create(false);
            this.missilesTimer.stop();
            this.missilesTimer.start();
        };
        TentacleBot.prototype.initMisslesPhysics = function () {
            for (var i = 0; i < 4; i++) {
                this.missiles.push(this.bullets.create(-50, -50, this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["key"], this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["bullets"]["frame"]));
                this.game.physics.enable(this.missiles[i], Phaser.Physics.ARCADE);
            }
        };
        TentacleBot.prototype.addAnimations = function () {
            _super.prototype.addAnimations.call(this);
            // Check why we need to call the idle animation
            this.sprite.animations.play(this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["idleAnimation"]);
        };
        /**
         * Wraps the fire logic
         */
        TentacleBot.prototype.fire = function () {
            // TODO: implement groups for missles
            if (this.missilesTimer.seconds > 10 || this.missilesTimer.seconds < 0) {
                this.initTimer();
            }
            if (this.missilesLaunched && this.missilesTimer.seconds > 4) {
                for (var i = 0; i < 4; i++) {
                    var bullet = this.missiles[i];
                    /* if(!soundFire && count > 158) {
                     soundFire = true;
                     mslsfx.play();
                     }*/
                    this.resetMisslesTexture("withFire");
                    bullet.body.velocity.x -= 35;
                    bullet.body.velocity.y -= 3;
                }
            }
            if (this.sprite.animations.currentAnim.name != 'shoot' || this.sprite.animations.currentAnim.isFinished) {
                if (this.missilesTimer.seconds > 3 && this.missilesTimer.seconds < 3.4) {
                    this.sprite.animations.play('fire');
                    if (!this.missilesLaunched) {
                        for (var i = 0; i < 4; i++) {
                            this.missiles[i].body.gravity.y = 66;
                            this.missiles[i].reset(this.sprite.x + (this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["missiles"][i]["x"]), this.sprite.y + (this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["missiles"][i]["y"]));
                        }
                        this.missilesLaunched = true;
                        this.playFireSound();
                    }
                }
                else {
                    if (this.missilesTimer.seconds > 5) {
                        this.missilesLaunched = false;
                        this.bulletTimer = this.game.time.time;
                        this.missilesTimer.stop();
                        this.missilesTimer.start();
                        this.resetMisslesTexture("withoutFire");
                    }
                    this.sprite.animations.play(this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["idleAnimation"]);
                }
            }
        };
        /**
         * Update missle texture
         * @param newTexture
         */
        TentacleBot.prototype.resetMisslesTexture = function (newTexture) {
            var _this = this;
            this.missiles.forEach(function (missle) { return missle.loadTexture(_this.sprite.key, newTexture); });
            return;
        };
        return TentacleBot;
    })(Superhero.EnemyBase);
    Superhero.TentacleBot = TentacleBot;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="EnemyBase.ts"/>
/// <reference path="Character.ts"/>
var Superhero;
(function (Superhero) {
    (function (BulletDirection) {
        BulletDirection[BulletDirection["STRAIGHT"] = 0] = "STRAIGHT";
        BulletDirection[BulletDirection["UP"] = 1] = "UP";
        BulletDirection[BulletDirection["DOWN"] = 2] = "DOWN";
    })(Superhero.BulletDirection || (Superhero.BulletDirection = {}));
    var BulletDirection = Superhero.BulletDirection;
    /**
     * TentacleBot base class
     */
    var TwoHandedEnemy = (function (_super) {
        __extends(TwoHandedEnemy, _super);
        function TwoHandedEnemy(game, enemyChar) {
            _super.call(this, game, enemyChar);
            this.addAnimations();
            this.initBullets();
            this.dieSound = this.game.add.audio("twoHandedDie", 0.4, false);
        }
        TwoHandedEnemy.prototype.initBullets = function () {
            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            // The bullets are "dead" by default, so they are not visible in the game
            this.bullets.createMultiple(2, "twoHandedWeapon", "downProjectile");
            this.bullets.createMultiple(2, "twoHandedWeapon", "upperProjectile");
            this.bullets.createMultiple(2, "twoHandedWeapon", "mainProjectile");
        };
        TwoHandedEnemy.prototype.addAnimations = function () {
            _super.prototype.addAnimations.call(this);
            // Check why we need to call the idle animation
            this.sprite.animations.play(this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["idleAnimation"]);
        };
        /**
         * Wraps the fire logic
         */
        TwoHandedEnemy.prototype.fire = function () {
            if (this.sprite.alive) {
                if (this.fireEnabled) {
                    if ((this.sprite.animations.currentAnim.name != 'shootRightWhenDown' || this.sprite.animations.currentAnim.name != 'shootRightWhenUp' || this.sprite.animations.currentAnim.name != 'shootLeft' || this.sprite.animations.currentAnim.isFinished) && this.sprite.animations.currentAnim.name != 'takehit') {
                        //Check for shootRate
                        if (!this.shootTimeUp())
                            return;
                        if (this.lastFireLeft) {
                            // fire right hand
                            this.lastFireLeft = false;
                            if (this.spawnPoint == 150 /* TOP */) {
                                // shoot down
                                this.sprite.animations.play('shootRightWhenUp');
                                this.game.time.events.add(250, function () {
                                    this.fireBullet("downProjectile", 2 /* DOWN */);
                                }, this);
                            }
                            else {
                                this.sprite.animations.play('shootRightWhenDown');
                                this.game.time.events.add(250, function () {
                                    this.fireBullet("upperProjectile", 1 /* UP */);
                                }, this);
                            }
                        }
                        else {
                            // fire left hand
                            this.lastFireLeft = true;
                            this.sprite.animations.play('shootLeft');
                            setTimeout(function () {
                                this.fireBullet("mainProjectile", 0 /* STRAIGHT */);
                            }.bind(this), 250);
                        }
                        //Reset the timer
                        this.bulletTimer = this.game.time.time;
                    }
                }
            }
        };
        TwoHandedEnemy.prototype.fireBullet = function (bulletKey, bulletDirection) {
            var bullet = this.getCustomBullet(bulletKey);
            //If there is none (all are still flying) create new one.
            if (!bullet) {
                bullet = this.createNewBullet("twoHandedWeapon", bulletKey);
            }
            // Fire sound
            this.playFireSound();
            bullet.reset(this.sprite.x + (this.facing * 40), this.sprite.y + 15);
            if (bulletDirection != 0 /* STRAIGHT */) {
                if (bulletDirection == 2 /* DOWN */) {
                    bullet.body.velocity.y = 100;
                }
                else {
                    bullet.body.velocity.y = -100;
                }
            }
            bullet.checkWorldBounds = true;
            bullet.outOfBoundsKill = true;
            bullet.body.velocity.x = this.bulletVelocity;
            bullet.body.allowGravity = this.allowGravity;
            bullet.scale.setTo(this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["bulletScale"]);
        };
        TwoHandedEnemy.prototype.getCustomBullet = function (assetKey) {
            for (var i = 0; i < this.bullets.length; i++) {
                if (this.bullets.children[i].frameName === assetKey && !this.bullets.children[i].alive) {
                    return this.bullets.children[i];
                }
            }
            return null;
        };
        /**
         * Callback method when the character collides with a deadly object
         * @param {Phaser.Sprite} char   An instance of the character
         * @param {any}           object An instance of the collided object
         */
        TwoHandedEnemy.prototype.die = function (char, object) {
            // TODO: DRY
            if (this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["isImmortal"]) {
                return;
            }
            var elapsedTime = this.game.time.elapsedSince(this.dieTimer);
            if (elapsedTime < this.respawnDelay)
                return;
            this.dieTimer = this.game.time.time;
            // SFX
            if (this.game.conf.ISMUSICENABLED) {
                this.playGetHitSound();
            }
            if (object) {
                this.checkRocketCollision(object);
            }
            // Smoke emitter
            if (this.shield > 0) {
                if (!this.smokeEmitter.on) {
                    this.startSmokeEmitter();
                }
                this.shield -= 1;
                this.flickerSprite(0xFF0000);
                return false;
            }
            if (this.smokeEmitter.on) {
                this.stopSmokeEmitter();
            }
            // Update combo using enemy sields
            this.updateComboByEnemy();
            this.sprite.body.checkWorldBounds = true;
            this.sprite.body.outOfBoundsKill = true;
            if (this.game.conf.ISMUSICENABLED) {
                this.dieSound.play();
            }
            this.sprite.body.angularVelocity = this.game.rnd.integerInRange(-400, -300);
            if (this.bullets)
                this.bullets.forEachAlive(function (b) {
                    b.kill();
                }, this);
            this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation, this.game.rnd.integerInRange(-300, -400), this.sprite.body.acceleration);
            this.deadSince = this.game.time.time;
            return true;
        };
        return TwoHandedEnemy;
    })(Superhero.EnemyBase);
    Superhero.TwoHandedEnemy = TwoHandedEnemy;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="EnemyBase.ts"/>
/// <reference path="Character.ts"/>
var Superhero;
(function (Superhero) {
    /**
     * TentacleBot base class
     */
    var MiniBoss = (function (_super) {
        __extends(MiniBoss, _super);
        function MiniBoss(game, enemyChar) {
            _super.call(this, game, enemyChar);
            this.addAnimations();
        }
        MiniBoss.prototype.addAnimations = function () {
            _super.prototype.addAnimations.call(this);
            // Check why we need to call the idle animation
            this.sprite.animations.play("flystill");
        };
        /**
         * Wraps the fire logic
         */
        MiniBoss.prototype.fire = function () {
            if (this.sprite.alive) {
                if (this.fireEnabled) {
                    if (this.sprite.animations.currentAnim.name != 'shoot' || this.sprite.animations.currentAnim.isFinished) {
                        //Check for shootRate
                        if (!this.shootTimeUp())
                            return;
                        this._state.pausePatrol();
                        this.sprite.animations.play('shoot', this.game.conf.CHARACTERSCOLLECTION[this.sprite.key]["shootAnimationFrames"]);
                        // Stop tween and play new animation
                        this.game.time.events.add(1000, function () {
                            this.fireBullet();
                        }, this);
                    }
                }
            }
        };
        MiniBoss.prototype.fireBullet = function () {
            if (this.sprite.alive) {
                var lastBulletX = this.sprite.x - (this.sprite.width * this.sprite.anchor.x);
                var beamWidth = 0;
                for (var i = 0; beamWidth < this.game.width; i++) {
                    // TODO: maybe load it on a level preloader
                    //Get the first bullet that has gone offscreen
                    var bullet = this.getCustomBullet("blueBeam");
                    //If there is none (all are still flying) create new one.
                    if (!bullet) {
                        bullet = this.createNewBullet();
                    }
                    bullet.alpha = 1;
                    bullet.anchor.setTo(1, 0);
                    bullet.reset(lastBulletX, this.sprite.y);
                    // Fire sound
                    this.playFireSound();
                    bullet.checkWorldBounds = true;
                    bullet.outOfBoundsKill = true;
                    bullet.body.velocity.x = 0;
                    lastBulletX = lastBulletX - bullet.width;
                    this.game.add.tween(bullet).to({ alpha: 0 }, 600, Phaser.Easing.Bounce.In, true, 0, 0, false).onComplete.add(function (b) {
                        b.kill();
                    }, this);
                    beamWidth += bullet.width;
                }
                this._state.resumePatrol();
                this.resetFireTimer();
            }
        };
        MiniBoss.prototype.getCustomBullet = function (assetKey) {
            for (var i = 0; i < this.bullets.length; i++) {
                if (this.bullets.children[i].frameName === assetKey && !this.bullets.children[i].alive) {
                    return this.bullets.children[i];
                }
            }
            return null;
        };
        /**
         * Callback method when the character collides with a deadly object
         * @param {Phaser.Sprite} char   An instance of the character
         * @param {any}           object An instance of the collided object
         */
        MiniBoss.prototype.die = function (char, object) {
            if (this.shield < 1) {
                this.sprite.body.velocity.x = 80;
                if (this.bullets)
                    this.bullets.forEachAlive(function (b) {
                        b.kill();
                    }, this);
            }
            return _super.prototype.die.call(this, char, object);
        };
        return MiniBoss;
    })(Superhero.EnemyBase);
    Superhero.MiniBoss = MiniBoss;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="EnemyBase.ts"/>
/// <reference path="Character.ts"/>
var Superhero;
(function (Superhero) {
    /**
     * TentacleBot base class
     */
    var SmallMissileEnemy = (function (_super) {
        __extends(SmallMissileEnemy, _super);
        function SmallMissileEnemy(game, enemyChar) {
            _super.call(this, game, enemyChar);
            this.addAnimations();
            this.initPhysics();
            this.sprite.events.onKilled.add(function () {
                this.warningSound.stop();
                this.sirenSound.stop();
                this.missileSound.stop();
                this.die(this.sprite);
            }, this);
        }
        SmallMissileEnemy.prototype.addAnimations = function () {
            _super.prototype.addAnimations.call(this);
            // Check why we need to call the idle animation
            this.sprite.animations.play("flystill");
        };
        /**
         * Initialize instance audio
         */
        SmallMissileEnemy.prototype.initAudio = function () {
            _super.prototype.initAudio.call(this);
            this.warningSound = this.game.add.audio("smallMissileWarningSound", 0.5, false);
            this.sirenSound = this.game.add.audio("smallMissileSiren", 0.3, true);
            this.missileSound = this.game.add.audio("smallMissileMissile", 1, false);
        };
        /**
         * Update method. Here should be all the logic related to the character's game loop
         */
        SmallMissileEnemy.prototype.update = function () {
            _super.prototype.update.call(this);
            this.game.physics.arcade.collide(this.game.state.states.Level1.hero.sprite, this.sprite, this.handleHeroCollition, null, this);
            this.game.state.states.Level1.obstacleManager.diesWith(this.sprite, this.game.state.states.Level1.killWallEnemy, this.game.state.states.Level1);
        };
        SmallMissileEnemy.prototype.handleHeroCollition = function (object, smallMissileEnemy) {
            this.game.state.states.Level1.hero.die(object, smallMissileEnemy);
        };
        /**
         * Wraps the fire logic
         */
        SmallMissileEnemy.prototype.fire = function () {
            if (this.sprite.alive) {
                if (this.sprite.animations.currentAnim.name != 'shoot' || this.sprite.animations.currentAnim.isFinished) {
                    //Check for shootRate
                    var elapsedTime = this.game.time.elapsedSince(this.bulletTimer);
                    if (elapsedTime < this.shootDelay)
                        return;
                    this.sprite.animations.play('shoot');
                    this._state.engage();
                }
            }
        };
        return SmallMissileEnemy;
    })(Superhero.EnemyBase);
    Superhero.SmallMissileEnemy = SmallMissileEnemy;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
var Superhero;
(function (Superhero) {
    var Debug = (function () {
        function Debug(game) {
            this.game = game;
            this.init();
        }
        Debug.prototype.init = function () {
            var style = { font: "14px Courier", fill: "#ffffff", align: "left" };
            this.info = this.game.add.text(16, 16, ' ', style);
            this.info.lineSpacing = 4;
            this.info.setShadow(2, 2);
        };
        Debug.prototype.update = function () {
            var s = "";
            this.game.time.advancedTiming = true;
            s = s.concat("FPS: " + (this.game.time.fps.toString() || '--') + "\n");
            s = s.concat("Game size: " + this.game.width + " x " + this.game.height + "\n");
            s = s.concat("Actual size: " + this.game.scale.width + " x " + this.game.scale.height + "\n");
            s = s.concat("minWidth: " + this.game.scale.minWidth + " - minHeight: " + this.game.scale.minHeight + "\n");
            s = s.concat("maxWidth: " + this.game.scale.maxWidth + " - maxHeight: " + this.game.scale.maxHeight + "\n");
            s = s.concat("aspect ratio: " + this.game.scale.aspectRatio + "\n");
            s = s.concat("parent is window: " + this.game.scale.parentIsWindow + "\n");
            s = s.concat("bounds x: " + this.game.scale.bounds.x + " y: " + this.game.scale.bounds.y + " width:" + this.game.scale.bounds.width + " height: " + this.game.scale.bounds.height + "\n");
            this.info.text = s;
        };
        return Debug;
    })();
    Superhero.Debug = Debug;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
var Superhero;
(function (Superhero) {
    var Config = (function () {
        function Config() {
            // Parse JSON values from game config file path
            var remoteValues = this.getRemote();
            this.WORLD = JSON.parse(remoteValues).WORLD;
            this.PHYSICS = JSON.parse(remoteValues).PHYSICS;
            this.PLAYERDIEOUTOFBOUNDS = JSON.parse(remoteValues).PLAYERDIEOUTOFBOUNDS;
            this.ENEMIES = JSON.parse(remoteValues).ENEMIES;
            this.PLAYERISIMMORTAL = JSON.parse(remoteValues).PLAYERISIMMORTAL;
            this.ISMUSICENABLED = JSON.parse(remoteValues).ISMUSICENABLED;
            this.CHARACTERSCOLLECTION = JSON.parse(remoteValues).CHARACTERSCOLLECTION;
            this.FIRSTTIMEPLAYING = JSON.parse(remoteValues).FIRSTTIMEPLAYING;
            this.POWERUPS = JSON.parse(remoteValues).POWERUPS;
            this.SCOREBOARD = JSON.parse(remoteValues).SCOREBOARD;
            this.TOPSCORE = JSON.parse(remoteValues).TOPSCORE;
            this.GAMEVERSION = JSON.parse(remoteValues).GAMEVERSION;
        }
        Config.prototype.save = function () {
            if (sh.state.current == 'Level1') {
                this.POWERUPS.nukes = sh.state.states.Level1.hero.nukes;
                this.POWERUPS.rockets = sh.state.states.Level1.hero.bombs;
                this.POWERUPS.timeWarps = sh.state.states.Level1.hero.timeWarps;
                if (!sh.state.states.Level1.hero.sprite.alive) {
                    var score = { date: Date.now(), score: sh.state.states.Level1.ui.scoreCount };
                    if (score.score > this.TOPSCORE)
                        this.TOPSCORE = score.score;
                    this.SCOREBOARD.push(score);
                }
            }
            localStorage.setItem('superhero.conf', JSON.stringify(this));
        };
        Config.prototype.getRemote = function () {
            var conf = localStorage.getItem('superhero.conf');
            if (conf) {
                return conf;
            }
            return $.ajax({
                type: "GET",
                url: "game/config/config.json",
                async: false
            }).responseText;
        };
        return Config;
    })();
    Superhero.Config = Config;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../utils/Utils.ts"/>
var Obstacles;
(function (Obstacles) {
    var Obstacle = (function () {
        function Obstacle(game) {
            this.gameSpeed = -80;
            this.game = game;
            this.group = this.game.add.group();
            this.group.enableBody = true;
            this.group.physicsBodyType = Phaser.Physics.ARCADE;
            this.group.classType = ObstacleItem;
            this.obstacleRespawnTime = 800;
            this.baseRespawn = 800;
            this.timer = this.game.time.time;
        }
        Obstacle.prototype.resetAndRoll = function (n, multiplier, speed) {
        };
        Obstacle.prototype.collidesWith = function (object) {
        };
        Obstacle.prototype.diesWith = function (object, callback, listenerContext) {
        };
        Obstacle.prototype.speedUp = function (baseSpeed, multiplier) {
        };
        Obstacle.prototype.killAll = function () {
        };
        return Obstacle;
    })();
    Obstacles.Obstacle = Obstacle;
    // TODO: maybe we can have an specific ts file for each obstacle type
    var WallObstacle = (function (_super) {
        __extends(WallObstacle, _super);
        function WallObstacle(game) {
            _super.call(this, game);
            this.upperObstacle = new UpperObstacle(game);
            this.lowerObstacle = new LowerObstacle(game);
        }
        WallObstacle.prototype.resetAndRoll = function (n, multiplier, speed) {
            var elapsedTime = this.game.time.elapsedSince(this.timer);
            if (elapsedTime < this.obstacleRespawnTime)
                return;
            this.timer = this.game.time.time;
            var itemHeight = this.game.cache.getFrameByName('meteors', 'brown5').height;
            var viewportHeight = this.game.height;
            var total = Math.floor(viewportHeight / itemHeight);
            var center = this.game.rnd.integerInRange(2, total - 2);
            var low = center - 1;
            var top = total - center - 1;
            var speed = this.gameSpeed * (1 + multiplier);
            this.upperObstacle.resetAndRoll(top, multiplier, speed);
            this.lowerObstacle.resetAndRoll(low, multiplier, speed);
        };
        WallObstacle.prototype.collidesWith = function (object) {
            this.lowerObstacle.collidesWith(object);
            this.upperObstacle.collidesWith(object);
        };
        WallObstacle.prototype.diesWith = function (object, callback, listenerContext) {
            this.lowerObstacle.diesWith(object, callback, listenerContext);
            this.upperObstacle.diesWith(object, callback, listenerContext);
        };
        WallObstacle.prototype.speedUp = function (baseSpeed, multiplier) {
            this.obstacleRespawnTime = this.baseRespawn / (1 + multiplier);
            this.upperObstacle.speedUp(baseSpeed, multiplier);
            this.lowerObstacle.speedUp(baseSpeed, multiplier);
        };
        WallObstacle.prototype.killAll = function () {
            this.upperObstacle.killAll();
            this.lowerObstacle.killAll();
        };
        return WallObstacle;
    })(Obstacle);
    Obstacles.WallObstacle = WallObstacle;
    var UpperObstacle = (function (_super) {
        __extends(UpperObstacle, _super);
        function UpperObstacle() {
            _super.apply(this, arguments);
        }
        UpperObstacle.prototype.resetAndRoll = function (n, multiplier, speed) {
            var itemHeight = this.game.cache.getFrameByName('meteors', 'brown5').height;
            var viewportWidth = this.game.width;
            var positions = Superhero.Utils.orderdList(n);
            var sprites = ["brown5", "grey5"];
            var key = sprites[this.game.rnd.integerInRange(0, 1)];
            for (var i = 0; i < n; i++) {
                //Try to use all the dead bricks first
                var item = this.group.getFirstDead();
                //The -1 is there to avoid phaser killing the sprite before reaching the world.
                var x = viewportWidth - 1;
                var y = positions[i] * itemHeight;
                //If none is dead, then create a new one
                //Else recycle the old one
                if (!item)
                    item = this.group.create(x, y, 'meteors', key);
                else
                    item.reset(x, y);
                item.body.velocity.x = speed;
                item.body.immovable = true;
                item.outOfBoundsKill = true;
            }
        };
        UpperObstacle.prototype.collidesWith = function (object) {
            this.game.physics.arcade.collide(object, this.group);
        };
        UpperObstacle.prototype.diesWith = function (object, callback, listenerContext) {
            this.game.physics.arcade.overlap(object, this.group, callback, null, listenerContext);
        };
        UpperObstacle.prototype.speedUp = function (baseSpeed, multiplier) {
            this.group.forEach(function (o) {
                if (o.alive)
                    o.body.velocity.x = baseSpeed * (1 + multiplier);
            }, this);
        };
        UpperObstacle.prototype.killAll = function () {
            this.group.forEach(function (s) {
                s.kill();
            }, this);
        };
        return UpperObstacle;
    })(Obstacle);
    Obstacles.UpperObstacle = UpperObstacle;
    var LowerObstacle = (function (_super) {
        __extends(LowerObstacle, _super);
        function LowerObstacle() {
            _super.apply(this, arguments);
        }
        LowerObstacle.prototype.resetAndRoll = function (n, multiplier, speed) {
            var itemHeight = this.game.cache.getFrameByName('meteors', 'brown5').height;
            var viewportHeight = this.game.height;
            var viewportWidth = this.game.width;
            var positions = Superhero.Utils.orderdList(n);
            var sprites = ["brown5", "grey5"];
            var key = sprites[this.game.rnd.integerInRange(0, 1)];
            for (var i = 0; i < n; i++) {
                //Try to use all the dead bricks first
                var item = this.group.getFirstDead();
                //The -1 is there to avoid phaser killing the sprite before reaching the world.
                var x = viewportWidth - 1;
                var y = viewportHeight - itemHeight - (positions[i] * itemHeight);
                //If none is dead, then create a new one
                //Else recycle the old one
                if (!item)
                    item = this.group.create(x, y, 'meteors', key);
                else
                    item.reset(x, y);
                item.body.velocity.x = speed;
                item.body.immovable = true;
                item.outOfBoundsKill = true;
            }
        };
        LowerObstacle.prototype.collidesWith = function (object) {
            this.game.physics.arcade.collide(object, this.group);
        };
        LowerObstacle.prototype.diesWith = function (object, callback, listenerContext) {
            this.game.physics.arcade.overlap(object, this.group, callback, null, listenerContext);
        };
        LowerObstacle.prototype.speedUp = function (baseSpeed, multiplier) {
            this.group.forEach(function (o) {
                if (o.alive)
                    o.body.velocity.x = baseSpeed * (1 + multiplier);
            }, this);
        };
        LowerObstacle.prototype.killAll = function () {
            this.group.forEach(function (s) {
                s.kill();
            }, this);
        };
        return LowerObstacle;
    })(Obstacle);
    Obstacles.LowerObstacle = LowerObstacle;
    ;
    var MeteoriteShower = (function (_super) {
        __extends(MeteoriteShower, _super);
        function MeteoriteShower() {
            _super.apply(this, arguments);
        }
        MeteoriteShower.prototype.resetAndRoll = function (n, multiplier, speed) {
            var elapsedTime = this.game.time.elapsedSince(this.timer);
            if (elapsedTime < this.obstacleRespawnTime)
                return;
            this.timer = this.game.time.time;
            if (this.group.countLiving() > 30)
                return;
            n = 1;
            speed = this.gameSpeed * Math.sqrt(1 + multiplier);
            var meteorites = [];
            var randKey = [];
            meteorites = [
                { key: 'brown1', mass: 45 },
                { key: 'brown2', mass: 40 },
                { key: 'brown3', mass: 35 },
                { key: 'brown4', mass: 35 },
                { key: 'brown5', mass: 17 },
                { key: 'brown6', mass: 15 },
                { key: 'brown7', mass: 10 },
                { key: 'brown8', mass: 9 },
                { key: 'brown9', mass: 3 },
                { key: 'brown10', mass: 2 },
                { key: 'grey1', mass: 45 },
                { key: 'grey2', mass: 40 },
                { key: 'grey3', mass: 35 },
                { key: 'grey4', mass: 35 },
                { key: 'grey5', mass: 17 },
                { key: 'grey6', mass: 15 },
                { key: 'grey7', mass: 10 },
                { key: 'grey8', mass: 9 },
                { key: 'grey9', mass: 3 },
                { key: 'grey10', mass: 2 }
            ];
            for (var i = 0; i < n; i++) {
                randKey[i] = meteorites[this.game.rnd.integerInRange(0, meteorites.length - 1)];
            }
            var viewportHeight = this.game.height;
            var viewportWidth = this.game.width;
            var sector = viewportHeight / n;
            var randY = [];
            for (var i = 0; i < n; i++) {
                randY[i] = (this.game.rnd.integerInRange(i * sector, (i + 1) * sector));
            }
            //var randX = (viewportWidth + (30 * this.game.rnd.realInRange(0,3))) | 0;
            var randX = viewportWidth - 1;
            for (var i = 0; i < n; i++) {
                var stone = this.group.getFirstDead();
                if (!stone) {
                    stone = this.group.create(randX, randY[i], 'meteors', randKey[i].key);
                    stone.body.immovable = randKey[i].mass > 10;
                    stone.checkWorldBounds = true;
                    stone.onOutOfBoundsKill = true;
                }
                else {
                    stone.reset(randX, randY[i]);
                }
                stone.body.velocity.x = speed * this.game.rnd.realInRange(1, 3);
                stone.anchor.setTo(0.5, 0.5);
                stone.body.angularVelocity = this.game.rnd.integerInRange(-100, 100);
            }
            this.group.setAll('checkWorldBounds', true);
            this.group.setAll('outOfBoundsKill', true);
        };
        MeteoriteShower.prototype.collidesWith = function (object) {
            this.game.physics.arcade.collide(object, this.group);
        };
        MeteoriteShower.prototype.diesWith = function (object, callback, listenerContext) {
            this.game.physics.arcade.overlap(object, this.group, callback, null, listenerContext);
        };
        MeteoriteShower.prototype.speedUp = function (baseSpeed, multiplier) {
            if (this.obstacleRespawnTime <= 200)
                return;
            this.obstacleRespawnTime = this.baseRespawn / (1 + multiplier);
        };
        MeteoriteShower.prototype.killAll = function () {
            this.group.forEach(function (s) {
                s.kill();
                this.game.state.states.Level1.hero.updateCombo(0.1);
            }, this);
        };
        return MeteoriteShower;
    })(Obstacle);
    Obstacles.MeteoriteShower = MeteoriteShower;
    var ObstacleItem = (function (_super) {
        __extends(ObstacleItem, _super);
        function ObstacleItem(game, x, y, key, frame) {
            _super.call(this, game, x, y, key, frame);
        }
        return ObstacleItem;
    })(Phaser.Sprite);
    Obstacles.ObstacleItem = ObstacleItem;
})(Obstacles || (Obstacles = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../utils/Utils.ts"/>
/// <reference path="Obstacles"/>
var Obstacles;
(function (Obstacles) {
    (function (ObstacleType) {
        ObstacleType[ObstacleType["WALL"] = 0] = "WALL";
        ObstacleType[ObstacleType["UPPERWALL"] = 1] = "UPPERWALL";
        ObstacleType[ObstacleType["LOWERWALL"] = 2] = "LOWERWALL";
        ObstacleType[ObstacleType["METEORITE_SHOWER"] = 3] = "METEORITE_SHOWER";
    })(Obstacles.ObstacleType || (Obstacles.ObstacleType = {}));
    var ObstacleType = Obstacles.ObstacleType;
    /**
     * On every updatee must handle if it is time to spawn a new obstacle, and which obstacle to spawn.
     */
    var ObstacleManager = (function () {
        function ObstacleManager(game, respawn) {
            if (respawn === void 0) { respawn = 800; }
            this.multiplier = 0; //Each 20 secs + 0.1
            this.game = game;
            this.obstacleTimer = this.game.time.time;
            this.multiplierTimer = this.game.time.time;
            this.gameSpeed = -80;
            this.fxEnabled = this.game.conf.ISMUSICENABLED;
            this.obstacles = [];
            this.enabledObstacles = [];
            this.setObstaclesEmitter();
            this.particlesSound = [];
            for (var i = 1; i < 6; i++) {
                this.particlesSound.push(this.game.add.audio("obstacle" + i, 1, false));
            }
        }
        ObstacleManager.prototype.update = function () {
            if (this.obstacles.length <= 0)
                return;
            var elapsedSecs = this.game.time.elapsedSecondsSince(this.multiplierTimer);
            // Every 20 seconds increment the multiplier
            // TODO take this value from the config file
            if (elapsedSecs > 10) {
                this.multiplier += 0.1;
                this.multiplierTimer = this.game.time.time;
                this.speedUp();
            }
            var index = this.game.rnd.integerInRange(0, this.obstacles.length - 1);
            var obstacle = this.obstacles[index];
            obstacle.resetAndRoll(10, this.multiplier);
            this.obstacleTimer = this.game.time.time;
        };
        ObstacleManager.prototype.speedUp = function () {
            for (var j = 0; j < this.obstacles.length; j++) {
                this.obstacles[j].speedUp(this.gameSpeed, this.multiplier);
            }
        };
        ObstacleManager.prototype.collidesWith = function (object) {
            for (var j = 0; j < this.obstacles.length; j++) {
                this.obstacles[j].collidesWith(object);
            }
        };
        ObstacleManager.prototype.diesWith = function (object, callback, listenerContext) {
            for (var j = 0; j < this.obstacles.length; j++) {
                this.obstacles[j].diesWith(object, callback, listenerContext);
            }
        };
        ObstacleManager.prototype.killAll = function () {
            for (var j = 0; j < this.obstacles.length; j++) {
                this.obstacles[j].killAll();
            }
        };
        ObstacleManager.prototype.addObstacleToPool = function (otype) {
            switch (otype) {
                case 0 /* WALL */:
                    this.obstacles.push(new Obstacles.WallObstacle(this.game));
                    this.enabledObstacles.push(0 /* WALL */);
                    break;
                case 1 /* UPPERWALL */:
                    this.obstacles.push(new Obstacles.UpperObstacle(this.game));
                    this.enabledObstacles.push(1 /* UPPERWALL */);
                    break;
                case 2 /* LOWERWALL */:
                    this.obstacles.push(new Obstacles.LowerObstacle(this.game));
                    this.enabledObstacles.push(2 /* LOWERWALL */);
                    break;
                case 3 /* METEORITE_SHOWER */:
                    this.obstacles.push(new Obstacles.MeteoriteShower(this.game));
                    this.enabledObstacles.push(3 /* METEORITE_SHOWER */);
                    break;
            }
        };
        ObstacleManager.prototype.setObstaclesEmitter = function () {
            this.obstacleEmitter = this.game.add.emitter();
            this.obstacleEmitter.makeParticles('meteors', 'brown10');
            this.obstacleEmitter.gravity = 0;
        };
        ObstacleManager.prototype.particleBurst = function (pointer) {
            //  Position the emitter where the mouse/touch event was
            this.obstacleEmitter.x = pointer.x;
            this.obstacleEmitter.y = pointer.y;
            // Particles Sfx
            this.fxEnabled = this.game.conf.ISMUSICENABLED;
            if (this.fxEnabled)
                this.playPartitceSound();
            //  The first parameter sets the effect to "explode" which means all particles are emitted at once
            //  The second gives each particle a lifespan
            //  The third is ignored when using burst/explode mode
            //  The final parameter  is how many particles will be emitted in this single burst
            this.obstacleEmitter.start(true, 2000, null, 4);
        };
        ObstacleManager.prototype.playPartitceSound = function () {
            var particleSoundVal = this.game.rnd.integerInRange(0, 4);
            this.particlesSound[particleSoundVal].play();
        };
        return ObstacleManager;
    })();
    Obstacles.ObstacleManager = ObstacleManager;
})(Obstacles || (Obstacles = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Character.ts"/>
/// <reference path="Collectables.ts"/>
var Collectables;
(function (Collectables) {
    (function (CollectableType) {
        CollectableType[CollectableType["IMPROVE_FIRE"] = 0] = "IMPROVE_FIRE";
        CollectableType[CollectableType["IMPROVE_SHIELD"] = 1] = "IMPROVE_SHIELD";
        CollectableType[CollectableType["NUKE_BOMB"] = 2] = "NUKE_BOMB";
        CollectableType[CollectableType["TIME_WARP"] = 3] = "TIME_WARP";
        CollectableType[CollectableType["COIN"] = 4] = "COIN";
        CollectableType[CollectableType["DIAMOND"] = 5] = "DIAMOND";
        CollectableType[CollectableType["IMMUNITY"] = 6] = "IMMUNITY";
        CollectableType[CollectableType["BOMB"] = 7] = "BOMB";
        CollectableType[CollectableType["LIVES"] = 8] = "LIVES";
    })(Collectables.CollectableType || (Collectables.CollectableType = {}));
    var CollectableType = Collectables.CollectableType;
    var CollectableManager = (function () {
        function CollectableManager(game) {
            this.game = game;
            this.collectables = new Phaser.Group(this.game);
            this.onCollect = new Phaser.Signal;
        }
        CollectableManager.prototype.addCollectable = function (ctype) {
            switch (ctype) {
                case 0 /* IMPROVE_FIRE */:
                    var item = new Collectables.ImproveFirePower(this.game);
                    this.collectables.add(item);
                    break;
                case 1 /* IMPROVE_SHIELD */:
                    var item = new Collectables.ImprovedShield(this.game);
                    this.collectables.add(item);
                    break;
                case 2 /* NUKE_BOMB */:
                    var item = new Collectables.NukeBomb(this.game);
                    this.collectables.add(item);
                    break;
                case 3 /* TIME_WARP */:
                    var item = new Collectables.TimeWarp(this.game);
                    this.collectables.add(item);
                    break;
                case 5 /* DIAMOND */:
                    var item = new Collectables.Diamond(this.game);
                    this.collectables.add(item);
                    break;
                case 6 /* IMMUNITY */:
                    var item = new Collectables.Immunity(this.game);
                    this.collectables.add(item);
                    break;
                case 7 /* BOMB */:
                    var item = new Collectables.Bomb(this.game);
                    this.collectables.add(item);
                    break;
                case 8 /* LIVES */:
                    var item = new Collectables.Lives(this.game);
                    this.collectables.add(item);
                    break;
            }
        };
        CollectableManager.prototype.checkCollectedBy = function (character) {
            //For every collectable.
            this.collectables.forEach(function (item, character) {
                if (item.alive)
                    if (item.overlapWithChar(character))
                        this.onCollect.dispatch();
            }, this, false, character);
        };
        /**
         * Spawns a collectable where an object was standing.
         * @param x - X Coordinate
         * @param y - Y Coordinate
         */
        CollectableManager.prototype.spawnCollectable = function (x, y, index) {
            // Randomly respawn 1 out of 20 times unless a specific collectable was instructed
            //if (!index) if (this.game.rnd.integerInRange(0,5) != 2) return;
            var randSpawn = this.game.rnd.integerInRange(0, 150);
            var spawnItem = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5];
            if (randSpawn > spawnItem.length - 1)
                return;
            if (!index)
                index = spawnItem[randSpawn];
            // If there are no collectables created, return
            if (this.collectables.length < 1)
                return;
            // If there is already one spawned then return
            if (this.collectables.countLiving() >= 1)
                return;
            var coll = this.collectables.getAt(index);
            //// Otherwise spawn a random collectable
            //// For now the respawn is random
            //if (index) {
            //    var coll = this.collectables.getAt(index);
            //}
            //else
            //{
            //    var coll = this.collectables.getRandom();
            //}
            if (!coll)
                return;
            if (coll.alive)
                return;
            coll.spawnAt(x, y);
            coll.playAnimation();
        };
        return CollectableManager;
    })();
    Collectables.CollectableManager = CollectableManager;
})(Collectables || (Collectables = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Hero.ts"/>
/// <reference path="../character/EnemyBase.ts"/>
/// <reference path="../character/EnemyManager.ts"/>
/// <reference path="../character/TentacleBot.ts"/>
/// <reference path="../character/TwoHandedWeapon.ts"/>
/// <reference path="../character/MiniBoss.ts"/>
/// <reference path="../character/SmallMissileEnemy.ts"/>
/// <reference path="../utils/Debug.ts"/>
/// <reference path="../config/Config.ts"/>
/// <reference path="../ui/UI.ts"/>
/// <reference path="../core/Game.ts"/>
/// <reference path="../plugins/Gamepad.ts"/>
/// <reference path="../obstacles/ObstacleManager.ts"/>
/// <reference path="../collectables/Collectables.ts"/>
/// <reference path="../collectables/CollectableManager.ts"/>
var Superhero;
(function (Superhero) {
    var Level1 = (function (_super) {
        __extends(Level1, _super);
        function Level1() {
            _super.apply(this, arguments);
            this.levelID = "level1";
        }
        Level1.prototype.preload = function () {
        };
        Level1.prototype.create = function () {
            //Setup Physics Engine
            this.configurePhysics();
            //Configure Base Stage Options
            this.setBaseStage();
            this.configureInput();
            this.setActors();
            this.startMusic();
            this.setEnemyManager();
            this.startUI();
        };
        Level1.prototype.startUI = function () {
            this.ui = new Superhero.UI(this.game, this.hero);
        };
        Level1.prototype.update = function () {
            //Collisions
            this.checkForCollisions();
            //Updates
            this.hero.update();
            this.enemyManager.update();
            this.ui.update();
            //this.debug.update();
            //Obstacles
            this.obstacleManager.update();
            this.checkPCInput();
        };
        Level1.prototype.configurePhysics = function () {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = this.game.conf.PHYSICS.global.gravity.y;
        };
        Level1.prototype.setBaseStage = function () {
            // Setup paralax layer
            this.paralax1 = this.game.add.tileSprite(0, 0, 1800, 600, 'starfield');
            this.paralax1.autoScroll(-100, 0);
            //Setup Obstacle
            this.obstacleManager = new Obstacles.ObstacleManager(this.game, 800);
            //this.obstacleManager.addObstacleToPool(Obstacles.ObstacleType.WALL);
            this.obstacleManager.addObstacleToPool(3 /* METEORITE_SHOWER */);
            this.initCollectables();
        };
        Level1.prototype.setEnemyManager = function () {
            // Setup enemy manager
            this.enemyManager = new Superhero.EnemyManager(this.game, this.levelID);
        };
        Level1.prototype.initCollectables = function () {
            this.collectableManager = new Collectables.CollectableManager(this.game);
            this.collectableManager.addCollectable(0 /* IMPROVE_FIRE */);
            this.collectableManager.addCollectable(1 /* IMPROVE_SHIELD */);
            this.collectableManager.addCollectable(2 /* NUKE_BOMB */);
            this.collectableManager.addCollectable(3 /* TIME_WARP */);
            //this.collectableManager.addCollectable(Collectables.CollectableType.DIAMOND);
            this.collectableManager.addCollectable(7 /* BOMB */);
            //this.collectableManager.addCollectable(Collectables.CollectableType.IMMUNITY);
            this.collectableManager.addCollectable(8 /* LIVES */);
        };
        Level1.prototype.configureInput = function () {
            this.game.gamepad = new Gamepads.GamePad(this.game, 3 /* STICK_BUTTON */, 10 /* FOUR_FAN */);
            this.game.gamepad.buttonPad.button1.type = 4 /* SINGLE_THEN_TURBO */;
            this.game.gamepad.buttonPad.button2.type = 1 /* SINGLE */;
            this.game.gamepad.buttonPad.button2.enableCooldown(30);
            this.game.gamepad.buttonPad.button3.type = 1 /* SINGLE */;
            this.game.gamepad.buttonPad.button3.enableCooldown(10);
            this.game.gamepad.buttonPad.button4.type = 4 /* SINGLE_THEN_TURBO */;
            this.game.gamepad.stick1.settings.topSpeed = 600;
            this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(function () {
                event.preventDefault();
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(function () {
                event.preventDefault();
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(function () {
                event.preventDefault();
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(function () {
                event.preventDefault();
            }, this);
            this.pcFireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.pcNukeButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
            this.pcWarpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
            this.pcBombButton = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
            this.cursors = this.game.input.keyboard.createCursorKeys();
        };
        Level1.prototype.setActors = function () {
            this.hero = new Superhero.Hero(this.game);
            this.hero.setRespawnDelay(2000);
            this.ui = new Superhero.UI(this.game, this.hero);
            this.game.gamepad.buttonPad.button1.setOnPressedCallback(this.hero.fire, this.hero);
            // BUTTON2
            this.game.gamepad.buttonPad.button2.setOnPressedCallback(this.hero.fireNuke, this.hero);
            this.game.gamepad.buttonPad.button2.customCanTriggerCallback = (function () {
                return this.hero.nukes > 0 && this.hero.sprite.alive;
            }).bind(this);
            // BUTTON 3
            this.game.gamepad.buttonPad.button3.setOnPressedCallback(this.hero.fireWarp, this.hero);
            this.game.gamepad.buttonPad.button3.customCanTriggerCallback = (function () {
                return this.hero.timeWarps > 0 && this.hero.sprite.alive;
            }).bind(this);
            // BUTTON 4
            this.game.gamepad.buttonPad.button4.setOnPressedCallback(this.hero.fireRocket, this.hero);
        };
        Level1.prototype.startMusic = function () {
            if (this.game.conf.ISMUSICENABLED) {
                if (this.theme)
                    this.theme.destroy();
                this.theme = this.game.add.audio('theme', 0.5, true);
                this.theme.play();
            }
        };
        Level1.prototype.checkPCInput = function () {
            if (this.pcFireButton.isDown)
                this.hero.fire();
            if (this.pcNukeButton.isDown)
                this.hero.fireNuke();
            if (this.pcWarpButton.isDown)
                this.hero.fireWarp();
            if (this.pcBombButton.isDown)
                this.hero.fireRocket();
            if (this.cursors.down.isDown || this.cursors.up.isDown || this.cursors.left.isDown || this.cursors.right.isDown) {
                var speed = { x: 0, y: 0 };
                if (this.cursors.up.isDown)
                    speed.y = -400;
                if (this.cursors.down.isDown)
                    speed.y = 400;
                if (this.cursors.left.isDown)
                    speed.x = -400;
                if (this.cursors.right.isDown)
                    speed.x = 400;
                this.hero.move(speed);
            }
        };
        Level1.prototype.checkForCollisions = function () {
            var _this = this;
            var enemies = this.enemyManager.enemies;
            enemies.forEach(function (enmy) { return _this.hero.diesWithGroup(enmy.bullets); });
            this.obstacleManager.collidesWith(this.hero.sprite);
            this.obstacleManager.diesWith(this.hero.bullets, this.killWall, this);
            this.obstacleManager.diesWith(this.hero.rockets, this.killWall, this);
            enemies.forEach(function (enmy) {
                enmy.diesWithGroup(_this.hero.bullets);
                enmy.diesWithGroup(_this.hero.rockets);
                _this.obstacleManager.diesWith(enmy.bullets, _this.killWallEnemy, _this);
            });
            this.collectableManager.checkCollectedBy(this.hero);
        };
        Level1.prototype.killWall = function (bullet, wall) {
            if (bullet.frameName == 'bullet1') {
                bullet.kill();
                //If contains the word grey
                if (wall.frameName.indexOf("grey") > -1) {
                    return;
                }
            }
            wall.kill();
            var prevCombo = this.hero.comboLevel;
            this.hero.comboLevel += 0.1;
            if (Math.floor(this.hero.comboLevel) > Math.floor(prevCombo)) {
                this.ui.infoText.showComboText(this.hero.comboLevel);
            }
            //if (wall.frameName.indexOf("grey") > -1) {
            //    if (bullet.frameName == 'bullet1'){
            //        return
            //    }
            //};
            //one out of 20 must drop something
            this.collectableManager.spawnCollectable(wall.position.x, wall.position.y);
            this.obstacleManager.particleBurst(wall);
            this.ui.scoreUp(50);
        };
        Level1.prototype.killWallEnemy = function (bullet, wall) {
            wall.kill();
            this.obstacleManager.particleBurst(wall);
        };
        Level1.prototype.render = function () {
            //this.game.debug.body(this.hero.sprite);
            //this.obstacleManager.obstacles[0].group.forEach(function(e){
            //    this.game.debug.body(e);
            //},this);
        };
        Level1.prototype.shutdown = function () {
            this.game.world.removeAll();
        };
        return Level1;
    })(Phaser.State);
    Superhero.Level1 = Level1;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Level1.ts"/>
/// <reference path="../plugins/GamePad.ts"/>
var Superhero;
(function (Superhero) {
    var Menu = (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            _super.apply(this, arguments);
            this.showing = 1;
        }
        Menu.prototype.preload = function () {
        };
        Menu.prototype.create = function () {
            this.rankingText = [];
            // Setup paralax layer
            this.paralax2 = this.game.add.tileSprite(0, 0, 1800, 600, 'starfield');
            this.paralax2.autoScroll(-30, 0);
            // Setup paralax layer
            this.paralax1 = this.game.add.tileSprite(0, 0, 1800, 600, 'planets');
            this.paralax1.autoScroll(-60, 0);
            //this.returnKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
            this.background = this.game.add.tileSprite(0, 0, 1200, 600, 'menuBackground');
            this.background.autoScroll(-90, 0);
            this.hero = this.game.add.sprite(200, 100, 'hero1', this.game.conf.CHARACTERSCOLLECTION['hero1']["mainSprite"]);
            this.hero.scale.setTo(0.7, 0.7);
            var newCharAnims = this.game.conf.CHARACTERSCOLLECTION[this.hero.key]["animations"];
            for (var key in newCharAnims) {
                this.hero.animations.add(key, newCharAnims[key]["frames"], newCharAnims[key]["frameRate"], newCharAnims[key]["loop"], newCharAnims[key]["useNumericIndex"]);
            }
            ;
            this.mainText = this.game.add.sprite(70, this.game.height - 130, "superheroText");
            this.mainText.scale.setTo(1.1, 1.1);
            this.verstionText = this.game.add.text(this.world.width - 100, this.world.height - 25, "Version " + this.game.conf.GAMEVERSION, { font: "9px saranaigamebold", fill: "#d3d3d3", align: "left" });
            if (this.game.device.desktop) {
                this.showControlsInfo();
            }
            this.hero.animations.play('fly');
            this.game.input.onDown.add(this.parseMenu, this);
            this.game.physics.arcade.enable(this.hero);
            if (!this.game.conf.FIRSTTIMEPLAYING) {
                this.menu = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'mainMenu');
            }
            else {
                this.menu = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'mainMenuStartDisabled');
            }
            this.menu.anchor.setTo(0.5, 0.5);
            this.ranking = this.game.add.sprite(this.game.world.width + 200, this.game.world.centerY, 'ranking');
            this.ranking.scale.setTo(0.4);
            this.ranking.anchor.setTo(0.5, 0.5);
            var musicOnOffsetX = this.world.width - this.world.width / 5;
            var musicOnOffsetY = this.world.height - 100;
            var onOffFrame = (this.game.conf.ISMUSICENABLED ? 'on' : 'off');
            var style = { font: "25px saranaigamebold", fill: "#66C8FF", align: "center" };
            this.musicOnOffText = this.game.add.text(musicOnOffsetX - 100, musicOnOffsetY + 15, "SOUND", style);
            this.musicOnOff = this.game.add.sprite(musicOnOffsetX, musicOnOffsetY, 'onoff', onOffFrame);
            this.musicOnOff.inputEnabled = true;
            this.musicOnOff.events.onInputDown.add(this.switchMusic, this);
            this.theme = this.game.add.audio('menuTheme', 0.5);
            this.theme.loop = true;
            this.startSound = this.game.add.audio('menuStart', 1);
            if (this.game.conf.ISMUSICENABLED)
                this.theme.play();
            this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(function () {
                event.preventDefault();
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(function () {
                event.preventDefault();
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(function () {
                event.preventDefault();
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(function () {
                event.preventDefault();
            }, this);
        };
        Menu.prototype.switchMusic = function () {
            if (this.game.conf.ISMUSICENABLED) {
                this.game.conf.ISMUSICENABLED = false;
                this.theme.stop();
                this.musicOnOff.frame = 1;
                this.game.conf.save();
            }
            else {
                this.game.conf.ISMUSICENABLED = true;
                this.theme.play();
                this.musicOnOff.frame = 0;
                this.game.conf.save();
            }
        };
        Menu.prototype.parseMenu = function (event) {
            if (this.showing == 1)
                this.parseMainMenu(event);
            else
                this.parseRanking(event);
        };
        Menu.prototype.parseMainMenu = function (event) {
            // Calculate the corners of the menu
            var x1 = this.game.world.centerX - this.menu.width / 2, x2 = this.game.world.centerX + this.menu.width / 2, y1 = this.game.world.centerY - this.menu.height / 2, y2 = this.game.world.centerY + this.menu.height / 2;
            // Check if the click was inside the menu
            if (event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2) {
                // The choicemap is an array that will help us see which item was clicked
                // Get menu local coordinates for the click
                var x = event.x - x1, y = event.y - y1;
                // Calculate the choice
                var choice = Math.floor((y / 4) / 23) + 1;
                switch (choice) {
                    case 1:
                        if (!this.game.conf.FIRSTTIMEPLAYING) {
                            if (this.game.conf.ISMUSICENABLED) {
                                this.game.sound.stopAll();
                                this.startSound.play();
                            }
                            this.theme.fadeOut(2000);
                            this.hero.body.acceleration.x = 600;
                            this.game.time.events.add(2000, function () {
                                this.game.sound.stopAll();
                                this.game.state.start('Level1', true, false);
                            }, this);
                        }
                        break;
                    case 2:
                        if (this.game.conf.ISMUSICENABLED) {
                            this.game.sound.stopAll();
                            this.startSound.play();
                        }
                        this.theme.fadeOut(2000);
                        this.hero.body.acceleration.x = 600;
                        this.game.time.events.add(2000, function () {
                            this.game.sound.stopAll();
                            this.game.state.start('Intro', true, false);
                        }, this);
                        break;
                    case 3:
                        this.showRanking();
                        break;
                    case 4:
                        break;
                }
            }
        };
        Menu.prototype.showRanking = function () {
            this.showing = 2;
            this.game.add.tween(this.menu).to({ x: -this.menu.x }, 1000, Phaser.Easing.Exponential.In, true, 0, 0, false);
            this.game.add.tween(this.musicOnOff).to({ x: -this.world.width + this.musicOnOff.x }, 1000, Phaser.Easing.Exponential.In, true, 0, 0, false);
            this.game.add.tween(this.musicOnOffText).to({ x: -this.world.width + this.musicOnOffText.x }, 1000, Phaser.Easing.Exponential.In, true, 0, 0, false);
            if (this.controlsText)
                this.game.add.tween(this.controlsText).to({ x: -this.world.width + 30 }, 1000, Phaser.Easing.Exponential.In, true, 0, 0, false);
            this.game.add.tween(this.ranking).to({ x: this.world.centerX }, 1000, Phaser.Easing.Exponential.In, true, 0, 0, false).onComplete.addOnce(function () {
                var style = { font: "30px saranaigamebold", fill: "#FDCD08", align: "center" };
                var textx = this.game.world.centerX + 20;
                var texty = 111;
                var scoreboard = this.game.conf.SCOREBOARD;
                var scoreLength = scoreboard.length;
                scoreboard.sort(function (a, b) {
                    return a.score - b.score;
                });
                for (var i = 1; i <= 5; i++) {
                    if (!scoreboard[scoreLength - i])
                        break;
                    this.rankingText[i - 1] = this.game.add.text(textx, texty, scoreboard[scoreLength - i].score.toString(), style);
                    texty += 83;
                }
            }, this);
        };
        Menu.prototype.showMainMenu = function () {
            for (var i = 0; i < 5; i++) {
                if (this.rankingText[i]) {
                    this.rankingText[i].destroy();
                }
            }
            this.showing = 1;
            var musicOnOffsetX = this.world.width - this.world.width / 5;
            this.game.add.tween(this.menu).to({ x: -this.menu.x }, 1000, Phaser.Easing.Exponential.In, true, 0, 0, false);
            this.game.add.tween(this.musicOnOff).to({ x: musicOnOffsetX }, 1000, Phaser.Easing.Exponential.In, true, 0, 0, false);
            this.game.add.tween(this.musicOnOffText).to({ x: musicOnOffsetX - 100 }, 1000, Phaser.Easing.Exponential.In, true, 0, 0, false);
            this.game.add.tween(this.ranking).to({ x: this.world.width + 200 }, 1000, Phaser.Easing.Exponential.In, true, 0, 0, false);
            if (this.controlsText)
                this.game.add.tween(this.controlsText).to({ x: 30 }, 1000, Phaser.Easing.Exponential.In, true, 0, 0, false);
        };
        Menu.prototype.parseRanking = function (event) {
            // Calculate the corners of the menu
            var x1 = this.game.world.centerX - this.ranking.width / 2, x2 = this.game.world.centerX + this.ranking.width / 2, y1 = this.game.world.centerY - this.ranking.height / 2, y2 = this.game.world.centerY + this.ranking.height / 2;
            // Check if the click was inside the menu
            if (event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2) {
            }
            else {
                this.showMainMenu();
            }
        };
        Menu.prototype.shutdown = function () {
            this.game.world.removeAll();
        };
        Menu.prototype.showControlsInfo = function () {
            var style = { font: "15px saranaigamebold", fill: "#FDCD08", align: "center" };
            this.controlsText = this.game.add.text(30, this.world.height - 30, "MOVEMENT : Cursors or Mouse    SPACE : Fire    Z : Nuke Bomb    X : Time Warp    C : Launch Rocket", style);
        };
        return Menu;
    })(Phaser.State);
    Superhero.Menu = Menu;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Menu.ts"/>
/// <reference path="../plugins/Gamepad.ts"/>
var Superhero;
(function (Superhero) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            this.loadHolder = this.add.sprite(this.world.centerX, this.world.centerY, 'loadHolder');
            var offsetX = (this.loadHolder.width / 2) - 33;
            var offsetY = 23;
            this.preloadBar = this.add.sprite(this.world.centerX - offsetX, this.world.centerY + offsetY, 'loadingBar');
            this.preloadBar.anchor.setTo(0, 0.5);
            this.loadHolder.anchor.setTo(0.5);
            this.load.setPreloadSprite(this.preloadBar);
            this.loadAssets();
        };
        Preloader.prototype.create = function () {
            this.game.state.start('Menu', true, false);
        };
        Preloader.prototype.loadAssets = function () {
            var basepath = '/games/superhero';
            //Spritesheets
            this.game.load.atlasJSONHash('hero1', basepath + '/assets/hero1.png', basepath + '/assets/hero1.json');
            this.game.load.atlasJSONHash('herowalking', basepath + '/assets/hero1Walking.png', basepath + '/assets/hero1.json');
            this.game.load.atlasJSONHash('badie', basepath + '/assets/hero3.png', basepath + '/assets/hero3.json');
            this.game.load.atlasJSONHash('pups', basepath + '/assets/pups.png', basepath + '/assets/pups.json');
            this.game.load.atlasJSONHash('meteors', basepath + '/assets/meteors.png', basepath + '/assets/meteors.json');
            this.game.load.atlasJSONHash('bullets', basepath + '/assets/bullets.png', basepath + '/assets/bullets.json');
            this.game.load.atlasJSONHash('steel', basepath + '/assets/steel.png', basepath + '/assets/steel.json');
            this.game.load.atlasJSONHash('shields', basepath + '/assets/shields.png', basepath + '/assets/shields.json');
            this.game.load.atlasJSONHash('pupanim', basepath + '/assets/pupanim.png', basepath + '/assets/pupanim.json');
            this.game.load.atlasJSONHash('onoff', basepath + '/assets/onoff.png', basepath + '/assets/onoff.json');
            // Intro scene
            this.game.load.atlasJSONHash('introScene', basepath + '/assets/introScene.png', basepath + '/assets/introScene.json');
            //Single Images
            this.game.load.image('starfield', basepath + '/assets/starfield.png');
            this.game.load.image('spaceShipBackground1', basepath + '/assets/spaceShip1.png');
            this.game.load.image('spaceShipBackground2', basepath + '/assets/spaceShip2.png');
            this.game.load.image('planets', basepath + '/assets/planets.png');
            this.game.load.image('puinfo', basepath + '/assets/PUInfo.png');
            this.game.load.image('pauseBtn', basepath + '/assets/pauseBtn.png');
            this.game.load.image('menuBack', basepath + '/assets/menuBack.png');
            this.game.load.image('menuBackDisabled', basepath + '/assets/menuBack2.png');
            this.game.load.image('mainMenu', basepath + '/assets/mainMenu.png');
            this.game.load.image('mainMenuStartDisabled', basepath + '/assets/mainMenuStartDisabled.png');
            this.game.load.image('ranking', basepath + '/assets/ranking.png');
            this.game.load.image('menuBackground', basepath + '/assets/menuBackground.png');
            this.game.load.image('superheroText', basepath + '/assets/superheroText.png');
            this.game.load.image('skipIntro', basepath + '/assets/skipIntro.png');
            this.game.load.image('tut_pc_jump', basepath + '/assets/tutorial-02.png');
            this.game.load.image('tut_pc_pups', basepath + '/assets/tutorial-01.png');
            this.game.load.image('tut_pc_fire', basepath + '/assets/tutorial-04.png');
            this.game.load.image('tut_pc_move', basepath + '/assets/tutorial-03.png');
            this.game.load.image('tut_touch_move', basepath + '/assets/tutorial-05.png');
            this.game.load.image('tut_touch_jump', basepath + '/assets/tutorial-06.png');
            this.game.load.image('tut_touch_fire', basepath + '/assets/tutorial-07.png');
            // Smoke
            this.game.load.image('smoke', basepath + '/assets/smoke-puff.png');
            /** Enemies **/
            // Tentacle bot
            this.game.load.atlasJSONHash('tentabot01', basepath + '/assets/tentacleBot.png', basepath + '/assets/tentacleBot.json');
            // Two handed weapon enemy
            this.game.load.atlasJSONHash('twoHandedWeapon', basepath + '/assets/twoHandedWeapon.png', basepath + '/assets/twoHandedWeapon.json');
            // Mini Boss
            this.game.load.atlasJSONHash('miniBoss', basepath + '/assets/miniBoss.png', basepath + '/assets/miniBoss.json');
            // SmallMissileEnemy
            this.game.load.atlasJSONHash('smallMissileEnemy', basepath + '/assets/smallMissileEnemy.png', basepath + '/assets/smallMissileEnemy.json');
            /** Audio **/
            this.game.load.audio('theme', basepath + '/assets/sounds/demon_destroyer.ogg');
            this.game.load.audio('introTheme', basepath + '/assets/sounds/intro/introTheme.ogg');
            this.game.load.audio('enemyHit', basepath + '/assets/sounds/enemyHit.ogg');
            // Menu
            this.game.load.audio('menuTheme', basepath + '/assets/sounds/menu.ogg');
            // Hero
            this.game.load.audio('heroFire', basepath + '/assets/sounds/hero/fire.ogg');
            this.game.load.audio('heroFireWarp', basepath + '/assets/sounds/hero/fireWarp.ogg');
            this.game.load.audio('heroWarpEnd', basepath + '/assets/sounds/hero/warpEnd.ogg');
            this.game.load.audio('heroFireRocket', basepath + '/assets/sounds/hero/fireRocket.ogg');
            this.game.load.audio('heroFireNuke', basepath + '/assets/sounds/hero/fireNuke.ogg');
            this.game.load.audio('heroWarpMeanwhile', basepath + '/assets/sounds/hero/duringWarp.ogg');
            this.game.load.audio('heroGetHit', basepath + '/assets/sounds/hero/getHit.ogg');
            this.game.load.audio('heroTakeOff', basepath + '/assets/sounds/hero/introTakeOff.ogg');
            this.game.load.audio('heroDie', basepath + '/assets/sounds/hero/die.ogg');
            // PowerUps
            this.game.load.audio('shieldCollect', basepath + '/assets/sounds/pups/shield.ogg');
            this.game.load.audio('extraLifeCollect', basepath + '/assets/sounds/pups/extraLife.ogg');
            this.game.load.audio('timeWarpCollect', basepath + '/assets/sounds/pups/timeWarp.ogg');
            this.game.load.audio('rocketCollect', basepath + '/assets/sounds/pups/rocket.ogg');
            this.game.load.audio('nukeCollect', basepath + '/assets/sounds/pups/nuke.ogg');
            this.game.load.audio('bulletCollect', basepath + '/assets/sounds/pups/bullet.ogg');
            // Cheers
            this.game.load.audio('goodJob', basepath + '/assets/sounds/pups/goodJob.ogg');
            this.game.load.audio('congratulations', basepath + '/assets/sounds/pups/congratulations.ogg');
            this.game.load.audio('greatWork', basepath + '/assets/sounds/pups/greatWork.ogg');
            this.game.load.audio('menuStart', basepath + '/assets/sounds/pups/alright.ogg');
            // Mini Boss
            this.game.load.audio('miniBossFire', basepath + '/assets/sounds/miniBoss/blast.ogg');
            // Two handed weapon enemy
            this.game.load.audio('twoHandedFire', basepath + '/assets/sounds/twoHandedEnemy/twoHandedfire.ogg');
            this.game.load.audio('twoHandedDie', basepath + '/assets/sounds/twoHandedEnemy/die.ogg');
            // Tentacle bot
            this.game.load.audio('tentaBotFire', basepath + '/assets/sounds/tentacleBot/fire.ogg');
            // Badie
            this.game.load.audio('badieFire', basepath + '/assets/sounds/badie/badieFire.ogg');
            // Small missile enemy
            this.game.load.audio('smallMissileWarningSound', basepath + '/assets/sounds/smallMissileEnemy/warning.ogg');
            this.game.load.audio('smallMissileSiren', basepath + '/assets/sounds/smallMissileEnemy/siren.ogg');
            this.game.load.audio('smallMissileMissile', basepath + '/assets/sounds/smallMissileEnemy/missile.ogg');
            // Particles
            this.game.load.audio("obstacle1", basepath + '/assets/sounds/obstacles/obetacle1.ogg');
            this.game.load.audio("obstacle2", basepath + '/assets/sounds/obstacles/obetacle2.ogg');
            this.game.load.audio("obstacle3", basepath + '/assets/sounds/obstacles/obetacle3.ogg');
            this.game.load.audio("obstacle4", basepath + '/assets/sounds/obstacles/obetacle4.ogg');
            this.game.load.audio("obstacle5", basepath + '/assets/sounds/obstacles/obetacle5.ogg');
            Gamepads.GamePad.preloadAssets(this.game, basepath + '/assets');
        };
        return Preloader;
    })(Phaser.State);
    Superhero.Preloader = Preloader;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="Preloader.ts"/>
var Superhero;
(function (Superhero) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            this.load.image('loadHolder', '/games/superhero/assets/loading.png');
            this.load.image('loadingBar', '/games/superhero/assets/loadingBar.png');
        };
        Boot.prototype.create = function () {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    })(Phaser.State);
    Superhero.Boot = Boot;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../character/Hero.ts"/>
/// <reference path="../character/EnemyBase.ts"/>
/// <reference path="../character/EnemyManager.ts"/>
/// <reference path="../utils/Debug.ts"/>
/// <reference path="../config/Config.ts"/>
/// <reference path="../ui/UI.ts"/>
/// <reference path="../core/Game.ts"/>
/// <reference path="../plugins/Gamepad.ts"/>
/// <reference path="../obstacles/ObstacleManager.ts"/>
/// <reference path="../collectables/Collectables.ts"/>
/// <reference path="../collectables/CollectableManager.ts"/>
var Superhero;
(function (Superhero) {
    var Intro = (function (_super) {
        __extends(Intro, _super);
        function Intro() {
            _super.apply(this, arguments);
            this.levelID = "Intro";
            this.bootsCollected = false;
            this.playerCanInteract = true;
        }
        Intro.prototype.preload = function () {
        };
        Intro.prototype.create = function () {
            this.fxEnabled = this.game.conf.ISMUSICENABLED;
            this.musicEnabled = this.game.conf.ISMUSICENABLED;
            //Setup Physics Engine
            this.configurePhysics();
            //Configure Base Stage Options
            this.setBaseStage();
            this.configureInput();
            this.setActors("herowalking");
            this.startMusic();
            this.setEnemyManager();
            this.setIntroScene();
            //this.debug = new Debug(this.game);
        };
        Intro.prototype.update = function () {
            //Collisions
            this.checkForCollisions();
            //Updates
            this.hero.update();
            this.enemyManager.update();
            this.ui.update();
            //this.debug.update();
            //Obstacles
            this.obstacleManager.update();
            this.checkPCInput();
        };
        Intro.prototype.configurePhysics = function () {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = this.game.conf.PHYSICS.global.gravity.y;
        };
        Intro.prototype.setBaseStage = function () {
            this.paralax1 = this.game.add.tileSprite(0, 0, 1800, 600, 'starfield');
            this.paralax1.autoScroll(-10, 0);
            this.paralax2 = this.game.add.tileSprite(0, 0, 3600, 600, 'planets');
            this.paralax2.autoScroll(-30, 0);
            this.spaceShip1 = this.game.add.sprite(0, 0, "spaceShipBackground1");
            this.spaceShip2 = this.game.add.sprite(this.spaceShip1.width, 0, "spaceShipBackground2");
            this.game.physics.arcade.enable(this.spaceShip1);
            this.spaceShip1.body.velocity.x = -200;
            this.game.physics.arcade.enable(this.spaceShip2);
            this.spaceShip2.body.velocity.x = -200;
            this.paralax5 = this.game.add.tileSprite(0, this.world.height - 25, this.world.width, this.world.height - 25, 'steel', 'floor_c');
            this.paralax5.autoScroll(-200, 0);
            this.game.physics.arcade.enable(this.paralax5);
            this.paralax5.body.immovable = true;
            this.paralax5.physicsType = Phaser.SPRITE;
            //Setup Obstacle
            this.obstacleManager = new Obstacles.ObstacleManager(this.game, 800);
            this.initCollectables();
        };
        Intro.prototype.setEnemyManager = function () {
            // Setup enemy manager
            this.enemyManager = new Superhero.EnemyManager(this.game, this.levelID);
        };
        Intro.prototype.initCollectables = function () {
            this.collectableManager = new Collectables.CollectableManager(this.game);
        };
        Intro.prototype.configureInput = function () {
            // Create Gamepad using the plugin
            this.game.gamepad = new Gamepads.GamePad(this.game, 5 /* GESTURE_BUTTON */, 10 /* FOUR_FAN */);
            this.game.gamepad.touchInput.touchType = 1 /* TOUCH */;
            this.game.gamepad.buttonPad.button1.type = 4 /* SINGLE_THEN_TURBO */;
            // Disable buttons
            this.game.gamepad.buttonPad.button2.type = 1 /* SINGLE */;
            this.game.gamepad.buttonPad.button3.type = 1 /* SINGLE */;
            this.game.gamepad.buttonPad.button4.type = 4 /* SINGLE_THEN_TURBO */;
            this.game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(function () {
                event.preventDefault();
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(function () {
                event.preventDefault();
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(function () {
                event.preventDefault();
            }, this);
            this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(function () {
                event.preventDefault();
            }, this);
            this.pcFireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.pcNukeButton = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
            this.pcWarpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
            this.pcBombButton = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
            this.cursors = this.game.input.keyboard.createCursorKeys();
        };
        Intro.prototype.setActors = function (assetKey) {
            if (assetKey === void 0) { assetKey = "hero1"; }
            this.hero = new Superhero.Hero(this.game, assetKey);
            this.hero.sprite.body.gravity.y = 1500;
            this.hero.sprite.body.drag = 0;
            this.hero.sprite.body.height -= 15;
            this.hero.setIdleCallback(this.hero.run);
            // Set gamepad callbacks
            this.game.gamepad.touchInput.onTouchDownCallback = this.hero.jump.bind(this.hero);
            this.game.gamepad.buttonPad.button1.setOnPressedCallback(this.hero.fire, this.hero);
            // BUTTON2
            this.game.gamepad.buttonPad.button2.sprite.alpha = 0.3;
            // BUTTON 3
            this.game.gamepad.buttonPad.button3.sprite.alpha = 0.3;
            // BUTTON 4
            this.game.gamepad.buttonPad.button4.sprite.alpha = 0.3;
            this.hero._state = new Superhero.StateRun(this.game, this.hero);
            this.hero._state.enterState();
            this.ui = new Superhero.UI(this.game, this.hero);
            this.skipIntroButton = this.game.add.sprite(this.game.width - 162, 8, "skipIntro");
            this.skipIntroButton.inputEnabled = true;
            this.skipIntroButton.events.onInputDown.add(this.finishLevel, this);
        };
        Intro.prototype.setIntroScene = function () {
            this.game.time.events.add((Phaser.Timer.SECOND * 2), this.showTutorial, this);
            //this.game.time.events.add(Phaser.Timer.SECOND * 20, this.spawnMiniBoss, this);
        };
        Intro.prototype.showTutorial = function () {
            this.tutorialImages = [];
            this.paralax5.stopScroll();
            this.spaceShip1.body.velocity.x = 0;
            this.spaceShip2.body.velocity.x = 0;
            this.hero.sprite.animations.paused = true;
            this.hero._state.isMoving = false;
            this.hero.sprite.animations.play("stopWalking");
            if (this.game.device.desktop)
                this.showDesktopTutorial();
            else
                this.showTouchTutorial();
        };
        Intro.prototype.startSlideShow = function () {
            if (this.currentTutorialImage)
                this.currentTutorialImage.destroy();
            if (this.enemyTextBoxGraphic)
                this.enemyTextBoxGraphic.destroy();
            this.currentTutorialImage = this.tutorialImages.pop();
            if (!this.currentTutorialImage) {
                this.paralax5.autoScroll(-200, 0);
                this.spaceShip1.body.velocity.x = -200;
                this.spaceShip2.body.velocity.x = -200;
                this.hero.sprite.animations.paused = false;
                this.hero._state.isMoving = true;
                this.hero.sprite.play(this.game.conf.CHARACTERSCOLLECTION[this.hero.sprite.key]["idleAnimation"]);
                this.hero._state.isMoving = false;
                this.game.time.events.add(Phaser.Timer.SECOND * 4.5, this.spawnMiniBoss, this);
                return;
            }
            this.currentTutorialImage.x = 150;
            this.currentTutorialImage.y = 150;
            this.currentTutorialImage.visible = true;
            this.enemyTextBoxGraphic = this.game.add.graphics(0, 0);
            this.enemyTextBoxGraphic.lineStyle(2, 0xdb6607, 1);
            this.enemyTextBoxGraphic.beginFill(0x000000, 0.8);
            this.enemyTextBoxGraphic.drawRect(120, 120, this.currentTutorialImage.width + 60, this.currentTutorialImage.height + 60);
            this.enemyTextBoxGraphic.endFill();
            this.game.world.bringToTop(this.currentTutorialImage);
            this.game.time.events.add((Phaser.Timer.SECOND * 4.5), this.startSlideShow, this);
        };
        Intro.prototype.showDesktopTutorial = function () {
            var pic1 = this.game.add.sprite(0, 0, 'tut_pc_jump');
            var pic2 = this.game.add.sprite(0, 0, 'tut_pc_pups');
            var pic3 = this.game.add.sprite(0, 0, 'tut_pc_fire');
            var pic4 = this.game.add.sprite(0, 0, 'tut_pc_move');
            // To correctly use array.pop()
            this.tutorialImages = [pic4, pic3, pic2, pic1];
            this.tutorialImages.forEach(function (pic) {
                pic.visible = false;
                //pic.scale = 0.6;
            }, this);
            this.startSlideShow();
        };
        Intro.prototype.showTouchTutorial = function () {
            var pic1 = this.game.add.sprite(0, 0, 'tut_touch_move');
            var pic2 = this.game.add.sprite(0, 0, 'tut_touch_jump');
            var pic3 = this.game.add.sprite(0, 0, 'tut_touch_fire');
            // To correctly use array.pop()
            this.tutorialImages = [pic3, pic2, pic1];
            this.tutorialImages.forEach(function (pic) {
                pic.visible = false;
                //pic.scale = 0.6;
            }, this);
            this.startSlideShow();
        };
        Intro.prototype.spawnMiniBoss = function () {
            if (this.enemyManager.totalEnemiesAlive() < 2) {
                this.enemyManager.spawnCustomEnemy("miniBoss");
                this.spaceShip1.body.velocity.x = 0;
                this.spaceShip2.body.velocity.x = 0;
                this.paralax5.stopScroll();
                this.hero.sprite.animations.paused = true;
                this.hero._state.isMoving = false;
                this.hero.sprite.animations.play("stopWalking");
                this.game.time.events.add(Phaser.Timer.SECOND * 1, this.displayTextScene1, this);
            }
        };
        Intro.prototype.spawnTwoHandedEnemy = function () {
            if (this.enemyManager.totalEnemiesAlive() < 2) {
                this.enemyManager.spawnCustomEnemy("twoHandedWeapon");
            }
        };
        Intro.prototype.displayTextScene1 = function () {
            // Set up scene
            // Text boxes
            // Enemy
            this.enemyTextBoxGraphic = this.game.add.graphics(0, 0);
            this.enemyTextBoxGraphic.lineStyle(2, 0x0000FF, 1);
            this.enemyTextBoxGraphic.beginFill(0x000000, 0.8);
            this.enemyTextBoxGraphic.drawRect(100, 10, this.game.world.width - 300, 200);
            this.enemyTextBoxGraphic.endFill();
            // Enemy
            this.enemyFace = this.game.add.sprite(this.game.world.width - 270, 70, "introScene", "enemy1");
            this.enemyFace.anchor.setTo(0.5, 0);
            this.enemyFace.scale.setTo(0.5);
            this.enemyFace.animations.add("introScene", ["enemy1", "enemy2", "enemy3", "enemy4", "enemy3", "enemy2"], 60, true, false);
            this.enemyFace.animations.play("introScene", 4, true, false);
            var style = { font: "30px saranaigamebold", fill: "#ffffff", align: 'left', wordWrap: true, wordWrapWidth: 650 };
            this.enemyText = this.game.add.text(410, 100, "You shall not pass :P", style);
            this.playerCanInteract = true;
            this.game.time.events.add(Phaser.Timer.SECOND * 5, this.displayTextScene2, this);
        };
        Intro.prototype.displayTextScene2 = function () {
            // Hero
            this.heroTextBoxGraphic = this.game.add.graphics(0, 0);
            this.heroTextBoxGraphic.lineStyle(2, 0x0000FF, 1);
            this.heroTextBoxGraphic.beginFill(0x000000, 0.8);
            this.heroTextBoxGraphic.drawRect(40, 250, this.game.world.width - 300, 200);
            this.heroTextBoxGraphic.endFill();
            // Face
            this.heroFace = this.game.add.sprite(100, 300, "introScene", "hero1");
            this.heroFace.anchor.setTo(0.5, 0);
            this.heroFace.scale.setTo(0.5);
            this.heroFace.animations.add("introScene", ["hero1", "hero2", "hero3", "hero4", "hero3", "hero2"], 60, true, false);
            this.heroFace.animations.play("introScene", 10, true, false);
            var style = { font: "30px saranaigamebold", fill: "#ffffff", align: 'left', wordWrap: true, wordWrapWidth: 650 };
            this.enemyText.setText("");
            this.heroText = this.game.add.text(220, 330, "Watch N See", style);
            this.game.time.events.add(Phaser.Timer.SECOND * 5, this.displayTextScene3, this);
        };
        Intro.prototype.displayTextScene3 = function () {
            this.heroText.setText("");
            this.enemyText.x = 220;
            this.enemyText.y -= 20;
            this.enemyText.setText("Why don't you talk with my friend here...");
            this.game.time.events.add(Phaser.Timer.SECOND * 5, this.displayTextScene4, this);
        };
        Intro.prototype.displayTextScene4 = function () {
            this.heroText.setText("");
            this.enemyText.y += 20;
            this.enemyText.setText("I'm pretty sure that you'll solve the issue... Bye");
            this.spawnTwoHandedEnemy();
            this.enemyManager.enemiesAlive[1].shield = 20;
            this.game.time.events.add(Phaser.Timer.SECOND * 5, this.displayTextScene5, this);
        };
        Intro.prototype.displayTextScene5 = function () {
            this.enemyManager.enemiesAlive[0].shield = 0;
            this.enemyManager.enemiesAlive[0].die(this.enemyManager.enemiesAlive[0].sprite);
            this.enemyText.destroy();
            this.heroText.setText("So, you seem to be a nice guy...");
            this.enemyTextBoxGraphic.destroy();
            this.enemyFace.kill();
            this.game.time.events.add(Phaser.Timer.SECOND * 5, this.displayTextScene6, this);
        };
        Intro.prototype.displayTextScene6 = function () {
            this.heroText.destroy();
            this.heroTextBoxGraphic.destroy();
            this.heroFace.kill();
            this.enemyManager.enemiesAlive[0].fireEnabled = true;
            this.enemyManager.enemiesAlive[0]._state.patrol(-150 /* DOWN */);
            this.enemyManager.enemiesAlive[0].shield = 3;
            this.enemyManager.enemiesAlive[0].sprite.events.onKilled.add(function (s) {
                this.generateBoots();
            }, this);
        };
        Intro.prototype.generateBoots = function () {
            // Boots
            this.playerCanInteract = false;
            this.hero._state.isMoving = true;
            this.hero.sprite.animations.paused = false;
            this.hero.sprite.play(this.game.conf.CHARACTERSCOLLECTION[this.hero.sprite.key]["idleAnimation"]);
            this.spaceShip1.body.velocity.x = -200;
            this.spaceShip2.body.velocity.x = -200;
            this.paralax5.autoScroll(-200, 0);
            this.bootsCollected = false;
            this.boots = this.game.add.sprite(this.game.world.width, this.game.world.height - 85, "introScene", "boots1");
            this.boots.anchor.setTo(0.5, 0);
            this.boots.scale.setTo(0.7);
            this.boots.animations.add("introScene", ["boots1", "boots2", "boots3", "boots2"], 60, true, false);
            this.boots.animations.add("introCollected", ["noBoots"], 6, true, false);
            this.boots.animations.play("introScene", 10, true, false);
            this.game.physics.arcade.enable(this.boots);
            this.boots.body.enable = true;
            this.boots.body.velocity.x = -200;
            this.game.gamepad.touchInput.inputDisable();
            this.game.gamepad.buttonPad.button1.sprite.inputEnabled = false;
            this.world.bringToTop(this.hero.sprite);
        };
        Intro.prototype.collectBoots = function () {
            this.bootsCollected = true;
            this.boots.animations.play("introCollected");
            if (this.game.conf.ISMUSICENABLED) {
                var takeOffSound = this.game.sound.add("heroTakeOff", 0.6, false);
                takeOffSound.play();
            }
            var actualCoor = { x: this.hero.sprite.x, y: this.hero.sprite.y };
            this.hero.sprite.x = -100;
            this.hero.sprite.y = -150;
            this.hero.sprite.body.enable = false;
            this.setActors();
            this.hero.sprite.x = actualCoor.x;
            this.hero.sprite.y = actualCoor.y;
            this.hero._state = new Superhero.StateIntroFly(this.game, this.hero);
            this.hero._state.enterState();
            this.hero.sprite.body.collideWorldBounds = false;
            this.game.physics.arcade.enable(this.paralax5);
            this.game.time.events.add(2650, this.stopGroundParalax, this);
            this.game.time.events.add(Phaser.Timer.SECOND * 9, this.finishLevel, this);
        };
        Intro.prototype.stopGroundParalax = function () {
            this.paralax5.stopScroll();
            this.paralax5.body.velocity.x = -200;
        };
        Intro.prototype.finishLevel = function () {
            this.game.sound.stopAll();
            // Persist first time played
            this.game.conf.FIRSTTIMEPLAYING = false;
            localStorage.setItem('superhero.conf', JSON.stringify(this.game.conf));
            // Start level 1
            this.game.state.start('Level1', true, false);
        };
        Intro.prototype.startMusic = function () {
            if (this.game.conf.ISMUSICENABLED) {
                if (this.theme)
                    this.theme.destroy();
                this.theme = this.game.add.audio('introTheme', 0.5, true);
                this.theme.play();
            }
        };
        Intro.prototype.checkPCInput = function () {
            if (this.playerCanInteract) {
                if (this.pcFireButton.isDown)
                    this.hero.fire();
                if (this.pcNukeButton.isDown)
                    this.hero.fireNuke();
                if (this.pcWarpButton.isDown)
                    this.hero.fireWarp();
                if (this.pcBombButton.isDown)
                    this.hero.fireRocket();
                if (this.cursors.up.isDown && this.hero.sprite.body.touching.down) {
                    var speed = { x: 0, y: 0 };
                    if (this.cursors.up.isDown)
                        speed.y = -800;
                    this.hero.move(speed);
                }
            }
        };
        Intro.prototype.checkForCollisions = function () {
            var _this = this;
            this.hero.collideWithObject(this.paralax5);
            var enemies = this.enemyManager.enemies;
            enemies.forEach(function (enmy) { return _this.hero.diesWithGroup(enmy.bullets); });
            this.obstacleManager.collidesWith(this.hero.sprite);
            this.obstacleManager.diesWith(this.hero.bullets, this.killWall, this);
            this.obstacleManager.diesWith(this.hero.rockets, this.killWall, this);
            enemies.forEach(function (enmy) {
                enmy.collideWithObject(enmy.shadow);
                enmy.diesWithGroup(_this.hero.bullets);
                enmy.diesWithGroup(_this.hero.rockets);
                _this.obstacleManager.diesWith(enmy.bullets, _this.killWall, _this);
            });
            this.collectableManager.checkCollectedBy(this.hero);
            if (this.boots && !this.bootsCollected) {
                this.game.physics.arcade.overlap(this.hero.sprite, this.boots, this.collectBoots, null, this);
            }
        };
        Intro.prototype.killWall = function (bullet, wall) {
            if (bullet.frameName == 'bullet1') {
                bullet.kill();
                //If contains the word grey
                if (wall.frameName.indexOf("grey") > -1) {
                    return;
                }
            }
            wall.kill();
            //if (wall.frameName.indexOf("grey") > -1) {
            //    if (bullet.frameName == 'bullet1'){
            //        return
            //    }
            //};
            //one out of 20 must drop something
            this.collectableManager.spawnCollectable(wall.position.x, wall.position.y);
            this.obstacleManager.particleBurst(wall);
            //this.ui.scoreUp(50);
        };
        Intro.prototype.shutdown = function () {
            this.game.world.removeAll();
        };
        return Intro;
    })(Phaser.State);
    Superhero.Intro = Intro;
})(Superhero || (Superhero = {}));
/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../states/Boot.ts"/>
/// <reference path="../states/Preloader.ts"/>
/// <reference path="../states/Menu.ts"/>
/// <reference path="../states/Level1.ts"/>
/// <reference path="../states/Intro.ts"/>
/// <reference path="../config/Config.ts"/>
/// <reference path="../plugins/GamePad.ts"/>
/// <reference path="../../lib/jquery.d.ts" />
var Superhero;
(function (Superhero) {
    /**
     * Main game class. Create the states of the game, inits the config object and starts the boot.
     * @class Game
     * @extends Phaser.Game
     *
     * @param {number} width - The viewport width. It originally sets the width of the world too.
     * @param {number} height - The viewport height. It originally sets the height of the world too.
     * @param {number} render - One of the Phaser render styles available [Phaser.CANVAS | Phaser.WEBGL | PHASER.AUTO]
     * @param {string} sh - The div name to the DOM object that will contain the instance of the game
     */
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            this.conf = new Superhero.Config();
            _super.call(this, this.conf.WORLD.width, this.conf.WORLD.height, Phaser.CANVAS, 'sh', null);
            this.state.add('Boot', Superhero.Boot, false);
            this.state.add('Preloader', Superhero.Preloader, false);
            this.state.add('Menu', Superhero.Menu, false);
            this.state.add('Level1', Superhero.Level1, false);
            this.state.add('Intro', Superhero.Intro, false);
            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Superhero.Game = Game;
})(Superhero || (Superhero = {}));
/// <reference path="Game.ts"/>
var sh;
window.onload = function () {
    sh = new Superhero.Game();
};
//# sourceMappingURL=output.js.map