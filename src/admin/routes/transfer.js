const router = require('express').Router();
const transferController = require('../controllers/transfer');
const { authentication, authorization } = require('../../middlewares/auth');

router.get('/search', authentication, authorization, transferController.getTransfer);
router.get('/search/query', authentication, authorization, transferController.searchReceiver);
router.get('/search/sender', authentication, authorization, transferController.searchSender);
router.delete('/:id', authentication, authorization, transferController.deleteTransfer)

module.exports = router;