const models = require('../db/index.js');
const router = require('express').Router();


router.get('/', (req, res) => {
  console.log('inside get UserData USER DATA');
  models.User.findAll({
    where: {
      account_type: { $notIn: ['admin', 'ADMIN'] }
    }
  }).then((users)=> res.status(200).send(users))
    .catch((err)=> res.status(400).send(err));
});

module.exports = router;
