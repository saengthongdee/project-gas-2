const express =require('express')
const router =express.Router()

const{findAllCylinderdeposit,CreateBulkDeposit,updateCylinderdeposit,deleteCylinderdeposit}=require('../controller/cylinderdepositController')

router.get('/',findAllCylinderdeposit)
router.post('/',CreateBulkDeposit)
router.put('/',updateCylinderdeposit)
router.delete('/:id',deleteCylinderdeposit)

module.exports=router
