import 'dotenv/config';
import validator from 'validator'
import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function registerParent(req, res) {

    const parent = req.body.parent
    const child = req.body.child
    const agreements = req.body.agreements

    try {

        let { firstName, lastName, email, password, password2 } = parent
        if (!firstName || !lastName || !email || !password || !password2) {

            return res.status(400).json({ errors: { "parent._global": 'Wszystkie pola są wymagane' } })
        }
        firstName = firstName.trim()
        lastName = lastName.trim()
        email = email.trim()

        if (!validator.isEmail(email)) {

            return res.status(400).json({ errors: { "parent.email": 'Nieprawidłowy format adresu e-mail' } })
        }

        if (password.length < 8) {

            return res.status(400).json({ errors: { "parent.password": 'Hasło jest za krótkie' } })
        }

        if (password != password2) {

            return res.status(400).json({ errors: { "parent.password": 'Hasła nie są takie same' } })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {

            return res.status(400).json({ errors: { "parent.email": 'Ten adres e-mail jest już zajęty' } });
        }

        let { childFirstName, childName, childAge, childPassword, childPassword2 } = child

        if (!childFirstName || !childName || !childAge || !childPassword || !childPassword2) {

            return res.status(400).json({ errors: { "child._global": 'Wszystkie pola są wymagane' } })
        }
        childFirstName = childFirstName.trim()
        childName = childName.trim()

        if (validator.isEmail(childName)) {
            return res.status(400).json({ errors: { "child.childName": 'Nazwa użytkownika nie może byc adresem email' } });
        }

        if (childPassword.length < 8) {

            return res.status(400).json({ errors: { "child.childPassword": 'Hasło jest za krótkie' } })
        }

        if (childPassword != childPassword2) {

            return res.status(400).json({ errors: { "child.childPassword": 'Hasła nie są takie same' } })
        }

        const existingChild = await User.findOne({ name: childName });
        if (existingChild) {

            return res.status(400).json({ errors: { "child.childName": 'Ta nazwa użytkownika jest już zajęta' } });
        }

        const childHashedPassword = await bcrypt.hash(childPassword, 10);

        let { acceptTerms, privacy, rodo, notifications } = agreements

        if (!acceptTerms) {

            return res.status(400).json({ errors: { "agreements.acceptTerms": 'Pole wymagane' } })
        }

        if (!privacy) {

            return res.status(400).json({ errors: { "agreements.privacy": 'Pole wymagane' } })
        }

        if (!rodo) {

            return res.status(400).json({ errors: { "agreements.rodo": 'Pole wymagane' } })
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        const newChild = new User({
            firstName: childFirstName,
            name: childName,
            age: childAge,
            password: childHashedPassword,
            role: 'child',
            points: 0
        })

        await newChild.save({ session });

        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newParent = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            role: 'parent',
            child: newChild._id,
            verificationToken,
            isVerified: false,
            newsletter: notifications
        })

        await newParent.save({ session });


        await session.commitTransaction();
        session.endSession();
        const url = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            to: email,
            subject: "Potwierdź swój e-mail - Twoja Aplikacja",
            html: `<h1>Witaj!</h1><p>Kliknij poniżej, aby aktywować konto:</p><a href="${url}">${url}</a>`
        });
        res.status(201).send('Konto utworzone')
    }
    catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ error: 'Podczas rejestracji wystąpił błąd. Spróbuj ponownie' })
    }

}
function generateRandomCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

async function generateUniqueCode() {
    let unique = false;
    let code;

    while (!unique) {
        code = generateRandomCode(6);
        const existing = await User.findOne({ code });
        if (!existing) unique = true;
    }

    return code;
}

export async function registerTherapist(req, res) {

    try {
        let { firstNameTherapist, lastNameTherapist, emailTherapist, passwordTherapist, password2Therapist } = req.body
        if (!firstNameTherapist || !lastNameTherapist || !emailTherapist || !passwordTherapist || !password2Therapist) {
            return res.status(400).json({ errors: { globalError: 'Wszystkie pola są wymagane' } })
        }

        firstNameTherapist = firstNameTherapist.trim()
        lastNameTherapist = lastNameTherapist.trim()
        emailTherapist = emailTherapist.trim()

        if (!validator.isEmail(emailTherapist)) {
            return res.status(400).json({ errors: { emailTherapist: 'Nieprawidłowy format adresu e-mail' } })
        }

        if (passwordTherapist.length < 8) {
            return res.status(400).json({ errors: { passwordTherapist: 'Hasło jest za krótkie' } })
        }

        if (passwordTherapist != password2Therapist) {
            return res.status(400).json({ errors: { password2Therapist: 'Hasła nie są takie same' } })
        }

        const existingUser = await User.findOne({ email: emailTherapist });
        if (existingUser) {

            return res.status(400).json({ errors: { emailTherapist: "Ten adres e-mail jest już zajęty" } });
        }

        const hashedPassword = await bcrypt.hash(passwordTherapist, 10);

        const code = await generateUniqueCode();
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newTherapist = new User({
            firstName: firstNameTherapist,
            lastName: lastNameTherapist,
            email: emailTherapist,
            password: hashedPassword,
            role: 'therapist',
            code,
            verificationToken,
            isVerified: false
        })


        await newTherapist.save();
        const url = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            to: emailTherapist,
            subject: "Potwierdź swój e-mail - Kraina Emocji",
            html: `<h1>Witaj!</h1><p>Kliknij poniżej, aby aktywować konto:</p><a href="${url}">${url}</a>`
        });
        res.status(201).send('Konto utworzone')
    }
    catch (err) {

        console.error('Registration error:', err.message);
        res.status(500).json({ message: 'Podczas rejestracji wystąpił błąd. Spróbuj ponownie' })
    }
}

export async function loginUser(req, res) {
    let { login, password } = req.body

    login = login.trim()

    if (!password || !login) {
        return res.status(400).json({ error: "Uzupełnij wszystkie pola" })
    }

    try {
        let user
        if (validator.isEmail(login)) {
            user = await User.findOne({ email: login });
        } else {
            user = await User.findOne({ name: login });
        }
        if (!user) {
            return res.status(401).json({ error: "Login lub hasło są nieprawidłowe" })
        }
        if (user.role !== 'child' && !user.isVerified) {
            return res.status(403).json({ error: "Twój adres e-mail nie został jeszcze potwierdzony. Sprawdź pocztę!" });
        }
        const isValid = await bcrypt.compare(password, user.password)

        if (!isValid) {
            return res.status(401).json({ error: "Login lub hasło są nieprawidłowe" })
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        user.refreshToken = refreshToken;
        await user.save();

        const role = user.role
        const id = user._id


        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dni
        });
        const name = user.firstName + " " + user.lastName;
        return res.json({ accessToken, role: role, id: id, name: name });

    }
    catch (err) {
        console.error('Login error:', err.message)
        return res.status(500).json({ error: 'Błąd podczas logowania. Spróbuj ponownie' })
    }
}

export async function refreshToken(req, res) {
    const token = req.cookies.refreshToken;

    if (!token) return res.status(401).json({ error: "Brak tokena" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ error: "Nieprawidłowy token" });
        }

        const newAccessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const name = user.firstName + " " + user.lastName;
        const role = user.role
        const id = user._id

        res.json({ accessToken: newAccessToken, role: role, id: id, name: name });
    } catch (err) {
        return res.status(403).json({ error: "Token wygasł lub jest nieprawidłowy" });
    }
}

export async function logoutUser(req, res) {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            const user = await User.findById(decoded.userId);

            if (user) {
                user.refreshToken = undefined;
                await user.save();
            }
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.sendStatus(204);
    } catch (err) {
        console.error("Logout error:", err.message);
        res.sendStatus(204);
    }


}
export async function verifyEmail(req, res) {
    const { token } = req.query;
    try {
        const user = await User.findOne({ verificationToken: token });
        if (!user) return res.status(400).json({ error: "Link jest nieprawidłowy lub wygasł." });

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();
        res.send("<h1>E-mail potwierdzony!</h1><p>Możesz teraz zamknąć to okno i się zalogować.</p>");
    } catch (err) {
        res.status(500).send("Błąd serwera.");
    }
}

export async function forgotPassword(req, res) {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "Użytkownik z tym adresem nie istnieje." });

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const url = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            to: email,
            subject: "Resetowanie hasła",
            html: `<p>Kliknij w link, aby ustawić nowe hasło (ważny 1h):</p><a href="${url}">${url}</a>`
        });
        res.json({ message: "Link do resetowania hasła został wysłany na Twój e-mail." });
    } catch (err) {
        res.status(500).json({ error: "Błąd serwera." });
    }
}

export async function resetPassword(req, res) {
    const { token, password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ error: "Token wygasł lub jest nieprawidłowy." });

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: "Hasło zostało pomyślnie zmienione." });
    } catch (err) {
        res.status(500).json({ error: "Błąd serwera." });
    }
}

