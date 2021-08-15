/**
 * Provides functions to control any SSD1306 OLED 0.96" from a Calliope Mini.
 */

// Maincode from https://github.com/Banbury/pxt-calliope-oled96
// MIT License Copyright (c) 2018 Banbury Copyright (c) 2018 Banbury
// Thanks to Supereugen for ExtendedCharactersCode
// https://github.com/SuperEugen/pxt-calliope-grove-ssd1327/blob/master/pxt-calliope-grove-ssd1327.ts
// MIT License Copyright (c) 2018 Ingo Hoffmann
// Changes by kleinswelt 13.08.2019
// MIT License Copyright (c) 2019 Michael Klein

//% color=#9F79EE icon="\uf108" block="M5 SSH1107 128x64 OLED"
namespace oledssd1306 {
    /**
     * Setzt das Display zurück und löscht es.
     * Sollte beim Start des Programms verwendet werden.
     */
    //% blockId=oledssd1306_init_display
    //% block="initialisiere Display"
    // initdisplaycodes from https://gist.githubusercontent.com/pulsar256/564fda3b9e8fc6b06b89/raw/4bb559d4088e42f7b4859a8533be920434818617/ssd1306_init.c
    export function initDisplay(): void {
        cmd(0xAE);  // Set display OFF		
        cmd(0xD5);  // Set Display Clock Divide Ratio / OSC Frequency 0xD4
        cmd(0x80);  // Display Clock Divide Ratio / OSC Frequency 
        cmd(0xA8);  // Set Multiplex Ratio
        cmd(0x3F);  // Multiplex Ratio for 128x64 (64-1)
        cmd(0xD3);  // Set Display Offset
        cmd(0x00);  // Display Offset
        cmd(0x40);  // Set Display Start Line
        cmd(0x8D);  // Set Charge Pump
        cmd(0x14);  // Charge Pump (0x10 External, 0x14 Internal DC/DC)
        cmd(0xA1);  // Set Segment Re-Map
        cmd(0xC8);  // Set Com Output Scan Direction
        cmd(0xDA);  // Set COM Hardware Configuration
        cmd(0x12);  // COM Hardware Configuration
        cmd(0x81);  // Set Contrast
        cmd(0xCF);  // Contrast
        cmd(0xD9);  // Set Pre-Charge Period
        cmd(0xF1);  // Set Pre-Charge Period (0x22 External, 0xF1 Internal)
        cmd(0xDB);  // Set VCOMH Deselect Level
        cmd(0x40);  // VCOMH Deselect Level
        cmd(0xA4);  // Set all pixels OFF
        cmd(0xA6);  // Set display not inverted
        cmd(0xAF);  // Set display On
        clearDisplay();
    }

    /**
     * Löscht das gesamte Display.
     */
    //% blockId=oledssd1306_clear_display
    //% block="lösche Display"
    export function clearDisplay() {
        cmd(DISPLAY_OFF);   //display off
        for (let j = 0; j < 8; j++) {
            setTextXY(j, 0);
            {
                for (let i = 0; i < 16; i++)  //clear all columns
                {
                    putChar(' ');
                }
            }
        }
        cmd(DISPLAY_ON);    //display on
        setTextXY(0, 0);
    }

    /**
     * Löscht einen Buchstabenbereich beginnend an der
     * Cursorposition.
     * @param n Number of characters to delete
     */
    //% blockId=oledssd1306_clear_range
    //% block="lösche %n| Zeichen"
    export function clearRange(n: number) {
        for (let i = 0; i < n; i++) {
            putChar(' ');
        }
    }

    /**
     * Bewegt den Cursor an eine neue Position.
     */
    //% row.min=0 row.max=7 
    //% column.min=0 column.max=15
    //% blockId=oledssd1306_set_text
    //% block="setze Cursor auf Zeile %row| und Spalte %column"
    export function setTextXY(row: number, column: number) {
        let r = row;
        let c = column;
        if (row < 0) { r = 0 }
        if (column < 0) { c = 0 }
        if (row > 7) { r = 7 }
        if (column > 15) { c = 15 }

        cmd(0xB0 + r);            //set page address
        cmd(0x00 + (8 * c & 0x0F));  //set column lower address
        cmd(0x10 + ((8 * c >> 4) & 0x0F));   //set column higher address
    }

    /**
     * Writes a single character to the display.
     */
    function putChar(c: string) {
        let c1 = c.charCodeAt(0);
        switch (c1) {
            case 196: writeCustomChar(extendedCharacters[0]); break;
            case 214: writeCustomChar(extendedCharacters[1]); break;
            case 220: writeCustomChar(extendedCharacters[2]); break;
            case 228: writeCustomChar(extendedCharacters[3]); break;
            case 246: writeCustomChar(extendedCharacters[4]); break;
            case 252: writeCustomChar(extendedCharacters[5]); break;
            case 223: writeCustomChar(extendedCharacters[6]); break;
            case 172: writeCustomChar(extendedCharacters[7]); break;
            case 176: writeCustomChar(extendedCharacters[8]); break;
            default:
                if (c1 < 32 || c1 > 127) //Ignore non-printable ASCII characters. This can be modified for multilingual font.
                {
                    writeCustomChar("\x00\xFF\x81\x81\x81\xFF\x00\x00");
                } else {
                    writeCustomChar(basicFont[c1 - 32]);
                }
        }
    }

    /**
     * Schreibt einen String an der aktuellen Cursorposition auf das Display.
     */
    //% blockId=oledssd1306_write_string
    //% block="schreibe %s|auf das Display"
    export function writeString(s: string) {
        putChar('A');
        for (let c of s) {
            putChar(c);
        }
    }

    /**
      * Schreibt eine Zahl an der aktuellen Cursorposition auf das Display.
      */
    //% blockId=oledssd1306_write_number
    //% block="schreibe Zahl %n|auf das Display"
    export function writeNumber(n: number) {
        oledssd1306.writeString("" + n)
   }

    /**
     * Ändert das Display zu weißer Schrift auf schwarzem Hintergrund.
     */
    //% blockId=oledssd1306_normal_display advanced=true
    //% block="weiss auf schwarz"
    export function normalDisplay() {
        cmd(NORMAL_DISPLAY);
    }

    /**
     * Ändert das Display zu schwarzer Schrift auf weißem Hintergrund.
     */
    //% blockId=oledssd1306_invert_display advanced=true
    //% block="schwarz auf weiss"
    export function invertDisplay() {
        cmd(INVERT_DISPLAY);
    }

    /**
     * Dreht den Displayinhalt auf den Kopf.
     */
    //% blockId=oledssd1306_flip_screen advanced=true
    //% block="drehe Display"
    export function flipScreen() {
        cmd(DISPLAY_OFF);
        cmd(COM_SCAN_INC);
        if (flipped) {
            cmd(0xA1)
        } else {
            cmd(0xA0);
        }
        cmd(DISPLAY_ON);
    }


    /**
     * Schaltet das Display aus.
     */
    //% blockId=oled96_turn_off advanced=true
    //% block="Display ausschalten"
    export function turnOff() {
        cmd(DISPLAY_OFF);
    }

    /**
     * Turns the display on.
     */
    //% blockId=oled96_turn_on advanced=true
    //% block="Display anschalten"
    export function turnOn() {
        cmd(DISPLAY_ON);
    }

    /**
     * Writes a custom character to the display
     * at the current cursor position.
     * A character is a string of 8 bytes. Each byte represesnts
     * a line of the character. The eight bits of each byte
     * represent the pixels of a line of the character.
     * Ex. "\x00\xFF\x81\x81\x81\xFF\x00\x00"
     * Only use in Javascriptmode! In Blockmode Makecode adds
     * extra backslashes.
     */
    //% blockId=oled96_write_custom_char advanced=true
    //% block="schreibe eigenes Zeichen %c"
    export function writeCustomChar(c: string) {
        for (let i = 0; i < 8; i++) {
            writeData(c.charCodeAt(i));
        }
    }

    /**
     * Sendet einen Befehl an das Display.
     * Nur verwenden wenn du weißt was du tust!
     */
    //% blockId=oled96_send_command advanced=true
    //% block="sende Befehl %c|an Display"
    export function cmd(c: number) {
        pins.i2cWriteNumber(0x3c, c, NumberFormat.UInt16BE);
    }

    /**
     * Schreibt ein Byte auf das Display.
     * Kann verwendet werden um das Display direkt zu beschreiben.
     */
    //% blockId=oled96_write_data advanced=true
    //% block="sende Datenbyte %n|an Display"
    export function writeData(n: number) {
        let b = n;
        if (n < 0) { n = 0 }
        if (n > 255) { n = 255 }

        pins.i2cWriteNumber(0x3c, 0x4000 + b, NumberFormat.UInt16BE);
    }
}

let flipped = false;

const DISPLAY_OFF = 0xAE;
const DISPLAY_ON = 0xAF;
const SET_DISPLAY_CLOCK_DIV = 0xD5;
const SET_MULTIPLEX = 0xA8;
const SET_DISPLAY_OFFSET = 0xD3;
const SET_START_LINE = 0x00;
const CHARGE_PUMP = 0x8D;
const EXTERNAL_VCC = false;
const MEMORY_MODE = 0x20;
const SEG_REMAP = 0xA1; // using 0xA0 will flip screen
const COM_SCAN_DEC = 0xC8;
const COM_SCAN_INC = 0xC0;
const SET_COM_PINS = 0xDA;
const SET_CONTRAST = 0x81;
const SET_PRECHARGE = 0xd9;
const SET_VCOM_DETECT = 0xDB;
const DISPLAY_ALL_ON_RESUME = 0xA4;
const NORMAL_DISPLAY = 0xA6;
const COLUMN_ADDR = 0x21;
const PAGE_ADDR = 0x22;
const INVERT_DISPLAY = 0xA7;
const ACTIVATE_SCROLL = 0x2F;
const DEACTIVATE_SCROLL = 0x2E;
const SET_VERTICAL_SCROLL_AREA = 0xA3;
const RIGHT_HORIZONTAL_SCROLL = 0x26;
const LEFT_HORIZONTAL_SCROLL = 0x27;
const VERTICAL_AND_RIGHT_HORIZONTAL_SCROLL = 0x29;
const VERTICAL_AND_LEFT_HORIZONTAL_SCROLL = 0x2A;

const basicFont: string[] = [
    "\x00\x00\x00\x00\x00\x00\x00\x00", // " "
    "\x00\x00\x5F\x00\x00\x00\x00\x00", // "!"
    "\x00\x00\x07\x00\x07\x00\x00\x00", // """
    "\x00\x14\x7F\x14\x7F\x14\x00\x00", // "#"
    "\x00\x24\x2A\x7F\x2A\x12\x00\x00", // "$"
    "\x00\x23\x13\x08\x64\x62\x00\x00", // "%"
    "\x00\x36\x49\x55\x22\x50\x00\x00", // "&"
    "\x00\x00\x05\x03\x00\x00\x00\x00", // "'"
    "\x00\x1C\x22\x41\x00\x00\x00\x00", // "("
    "\x00\x41\x22\x1C\x00\x00\x00\x00", // ")"
    "\x00\x08\x2A\x1C\x2A\x08\x00\x00", // "*"
    "\x00\x08\x08\x3E\x08\x08\x00\x00", // "+"
    "\x00\xA0\x60\x00\x00\x00\x00\x00", // ","
    "\x00\x08\x08\x08\x08\x08\x00\x00", // "-"
    "\x00\x60\x60\x00\x00\x00\x00\x00", // "."
    "\x00\x20\x10\x08\x04\x02\x00\x00", // "/"
    "\x00\x3E\x51\x49\x45\x3E\x00\x00", // "0"
    "\x00\x00\x42\x7F\x40\x00\x00\x00", // "1"
    "\x00\x62\x51\x49\x49\x46\x00\x00", // "2"
    "\x00\x22\x41\x49\x49\x36\x00\x00", // "3"
    "\x00\x18\x14\x12\x7F\x10\x00\x00", // "4"
    "\x00\x27\x45\x45\x45\x39\x00\x00", // "5"
    "\x00\x3C\x4A\x49\x49\x30\x00\x00", // "6"
    "\x00\x01\x71\x09\x05\x03\x00\x00", // "7"
    "\x00\x36\x49\x49\x49\x36\x00\x00", // "8"
    "\x00\x06\x49\x49\x29\x1E\x00\x00", // "9"
    "\x00\x00\x36\x36\x00\x00\x00\x00", // ":"
    "\x00\x00\xAC\x6C\x00\x00\x00\x00", // ";"
    "\x00\x08\x14\x22\x41\x00\x00\x00", // "<"
    "\x00\x14\x14\x14\x14\x14\x00\x00", // "="
    "\x00\x41\x22\x14\x08\x00\x00\x00", // ">"
    "\x00\x02\x01\x51\x09\x06\x00\x00", // "?"
    "\x00\x32\x49\x79\x41\x3E\x00\x00", // "@"
    "\x00\x7E\x09\x09\x09\x7E\x00\x00", // "A"
    "\x00\x7F\x49\x49\x49\x36\x00\x00", // "B"
    "\x00\x3E\x41\x41\x41\x22\x00\x00", // "C"
    "\x00\x7F\x41\x41\x22\x1C\x00\x00", // "D"
    "\x00\x7F\x49\x49\x49\x41\x00\x00", // "E"
    "\x00\x7F\x09\x09\x09\x01\x00\x00", // "F"
    "\x00\x3E\x41\x41\x51\x72\x00\x00", // "G"
    "\x00\x7F\x08\x08\x08\x7F\x00\x00", // "H"
    "\x00\x41\x7F\x41\x00\x00\x00\x00", // "I"
    "\x00\x20\x40\x41\x3F\x01\x00\x00", // "J"
    "\x00\x7F\x08\x14\x22\x41\x00\x00", // "K"
    "\x00\x7F\x40\x40\x40\x40\x00\x00", // "L"
    "\x00\x7F\x02\x0C\x02\x7F\x00\x00", // "M"
    "\x00\x7F\x04\x08\x10\x7F\x00\x00", // "N"
    "\x00\x3E\x41\x41\x41\x3E\x00\x00", // "O"
    "\x00\x7F\x09\x09\x09\x06\x00\x00", // "P"
    "\x00\x3E\x41\x51\x21\x5E\x00\x00", // "Q"
    "\x00\x7F\x09\x19\x29\x46\x00\x00", // "R"
    "\x00\x26\x49\x49\x49\x32\x00\x00", // "S"
    "\x00\x01\x01\x7F\x01\x01\x00\x00", // "T"
    "\x00\x3F\x40\x40\x40\x3F\x00\x00", // "U"
    "\x00\x1F\x20\x40\x20\x1F\x00\x00", // "V"
    "\x00\x3F\x40\x38\x40\x3F\x00\x00", // "W"
    "\x00\x63\x14\x08\x14\x63\x00\x00", // "X"
    "\x00\x03\x04\x78\x04\x03\x00\x00", // "Y"
    "\x00\x61\x51\x49\x45\x43\x00\x00", // "Z"
    "\x00\x7F\x41\x41\x00\x00\x00\x00", // """
    "\x00\x02\x04\x08\x10\x20\x00\x00", // "\"
    "\x00\x41\x41\x7F\x00\x00\x00\x00", // """
    "\x00\x04\x02\x01\x02\x04\x00\x00", // "^"
    "\x00\x80\x80\x80\x80\x80\x00\x00", // "_"
    "\x00\x01\x02\x04\x00\x00\x00\x00", // "`"
    "\x00\x20\x54\x54\x54\x78\x00\x00", // "a"
    "\x00\x7F\x48\x44\x44\x38\x00\x00", // "b"
    "\x00\x38\x44\x44\x28\x00\x00\x00", // "c"
    "\x00\x38\x44\x44\x48\x7F\x00\x00", // "d"
    "\x00\x38\x54\x54\x54\x18\x00\x00", // "e"
    "\x00\x08\x7E\x09\x02\x00\x00\x00", // "f"
    "\x00\x18\xA4\xA4\xA4\x7C\x00\x00", // "g"
    "\x00\x7F\x08\x04\x04\x78\x00\x00", // "h"
    "\x00\x00\x7D\x00\x00\x00\x00\x00", // "i"
    "\x00\x80\x84\x7D\x00\x00\x00\x00", // "j"
    "\x00\x7F\x10\x28\x44\x00\x00\x00", // "k"
    "\x00\x41\x7F\x40\x00\x00\x00\x00", // "l"
    "\x00\x7C\x04\x18\x04\x78\x00\x00", // "m"
    "\x00\x7C\x08\x04\x7C\x00\x00\x00", // "n"
    "\x00\x38\x44\x44\x38\x00\x00\x00", // "o"
    "\x00\xFC\x24\x24\x18\x00\x00\x00", // "p"
    "\x00\x18\x24\x24\xFC\x00\x00\x00", // "q"
    "\x00\x00\x7C\x08\x04\x00\x00\x00", // "r"
    "\x00\x48\x54\x54\x24\x00\x00\x00", // "s"
    "\x00\x04\x7F\x44\x00\x00\x00\x00", // "t"
    "\x00\x3C\x40\x40\x7C\x00\x00\x00", // "u"
    "\x00\x1C\x20\x40\x20\x1C\x00\x00", // "v"
    "\x00\x3C\x40\x30\x40\x3C\x00\x00", // "w"
    "\x00\x44\x28\x10\x28\x44\x00\x00", // "x"
    "\x00\x1C\xA0\xA0\x7C\x00\x00\x00", // "y"
    "\x00\x44\x64\x54\x4C\x44\x00\x00", // "z"
    "\x00\x08\x36\x41\x00\x00\x00\x00", // "{"
    "\x00\x00\x7F\x00\x00\x00\x00\x00", // "|"
    "\x00\x41\x36\x08\x00\x00\x00\x00", // "}"
    "\x00\x02\x01\x01\x02\x01\x00\x00"  // "~"
];
const extendedCharacters: string[] = [
    "\x00\x7D\x0A\x09\x0A\x7D\x00\x00", // "Ä"
    "\x00\x3D\x42\x41\x42\x3D\x00\x00", // "Ö"
    "\x00\x3D\x40\x40\x40\x3D\x00\x00", // "Ü"
    "\x00\x21\x54\x54\x55\x78\x00\x00", // "ä"
    "\x00\x39\x44\x44\x39\x00\x00\x00", // "ö"
    "\x00\x3D\x40\x40\x7D\x00\x00\x00", // "ü"
    "\x00\xFE\x09\x49\x36\x00\x00\x00", // "ß"
    "\x00\x14\x3E\x55\x55\x55\x14\x00", // "€"
    "\x00\x02\x05\x02\x00\x00\x00\x00"  // "°"
];
