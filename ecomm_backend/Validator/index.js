const { check, validationResult } = require('express-validator');

// exports.userSignUpValidator = (req,res,next)=> {
//     req.check('name', 'Name is required').notEmpty()     //check() method given by express validator to check if name is not empty
//     req.check('email','Email must be 3 to 32 characters long')
//     .matches(/.+\@.+\..+/)
//     .withMessage("Email must contain @")
//     .isLength({
//         min:4,
//         max:32
//     });
//     req.check('password','Password is required').notEmpty()
//     req.check('password')
//     .isLength({min:6})
//     .withMessage("Password must contain atleast 6 characters")
//     .matches(/\d/)  // regular expression to check that password must contain a number
//     .withMessage("Password must contain a number");
//     const errors = req.validationErrors();   //all error is returned by this method which is validation errors.
//     if(errors){
//         const firstError=errors.map(error => error.message)[0];
//         return res.status(400).json({ error: firstError });
//     }
//     next();  //This is a callback function which is used to go to next phase of execution. so that application will not halt
// };


exports.userSignUpValidator = [
    check('name')
      .notEmpty()
      .withMessage('Name is required'),
    
    check('email')
      .isLength({ min: 4, max: 32 })
      .withMessage('Email must be between 4 to 32 characters')
      .matches(/.+\@.+\..+/)
      .withMessage('Email must contain @'),
  
    check('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must contain at least 6 characters')
      .matches(/\d/)
      .withMessage('Password must contain a number'),
  
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
      }
      next();
    }
  ];
  