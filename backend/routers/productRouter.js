const express =require('express')
const router =express.Router()

const{findAllProduct,createProduct,updateProduct,deleteProduct}=require('../controller/productController')

router.get('/',findAllProduct)
router.post('/',createProduct)
router.put('/:id',updateProduct)
router.delete('/:id',deleteProduct)

module.exports=router
