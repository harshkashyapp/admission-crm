const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

app.use('/auth', require('./modules/auth/auth.routes'));
app.use('/master', require('./modules/master/master.routes'));
app.use('/seat-matrix', require('./modules/seat-matrix/seat-matrix.routes'));
app.use('/applicants', require('./modules/applicant/applicant.routes'));
app.use('/admissions', require('./modules/admission/admission.routes'));
app.use('/dashboard', require('./modules/dashboard/dashboard.routes'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;