import React, {useEffect, useState} from 'react';
import api from "../../plugins/axios/api";
import {useParams} from "react-router-dom";
import {Card, Carousel, Button, Tab, Tabs} from "react-bootstrap";
import styles from './ItemPage.module.css'
import ItemProperty from "../../components/ItemProperty/ItemProperty";
import {Cart2, Check} from "react-bootstrap-icons";
import cart from "../../store/cart";

const ItemPage = () => {
    let [itemHolder, setItemHolder] = useState([])
    let [isLoading, setIsLoading] = useState(true)
    let pageParams = useParams()
     useEffect(()=>{
        getData()
     }, [pageParams.id])

async function getData(){
   await api(`marketplace/nomenclature/${pageParams.id}`)

        .then((response)=>{
            setItemHolder(response.data)
            console.log(itemHolder)
        })
       .finally(()=>{
           setIsLoading(false)
       })
}

    function addToCart(id, qty){
        api.post('marketplace/cart/change/',{
            nomenclature: id,
            count: qty
        })
            .then((response)=>{


                if (response.status === 200){
                    setItemHolder({...itemHolder, cart_position:1})
                    console.log(itemHolder)
                    cart.requestInfo()
                }
            })
    }
    function deleteFromCart(id,qty){
        api.post('marketplace/cart/change/',{
            nomenclature: id,
            count: qty
        })
            .then((response)=>{
                if (response.status === 204){
                    setItemHolder({...itemHolder, cart_position:0})
                    console.log(itemHolder)
                }
                cart.requestInfo()
            })
    }

    return (
        <div>
        <Card>

            <Card.Body className={styles.mainBlocks}>
            {!isLoading &&
               <div className={styles.imgBlock}>
                   <div className={styles.imgVarsBlock}>
                       {itemHolder.images.map((item,index)=>(
                           <img key={item} className={styles.imgVars} src={item} alt=""/>
                       ))}
                   </div>
                  <img className={styles.mainImg} src={itemHolder.images[0]} alt="????????"/>
               </div>}
            <div className={styles.infoBlock}>
                <div className={styles.infoHeader}>
                <Card.Title><h3>{itemHolder.name}</h3></Card.Title>
            <div className={styles.itemCode}>?????? ????????????: {itemHolder.id}</div>
                </div>
                <div className={styles.description}>
                    {itemHolder.description}
                </div>
                <div className={styles.buyBlock}>
                    {itemHolder.cart_position === 0 &&
                        <Button onClick={() => {
                            addToCart(itemHolder.id, 1)
                        }} title={"?? ??????????????"} className={styles.cartBtn}>
                            ?? ?????????????? <Cart2/>
                        </Button>
                    }
                    {itemHolder.cart_position !== 0 &&
                        <Button variant={"outline-warning"} onClick={() => {
                            deleteFromCart(itemHolder.id, 0)
                        }} title={"?? ??????????????"} className={styles.cartBtn}>
                            ?? ?????????????? <Check size={'1.5rem'}></Check>
                        </Button>
                    }
                  <h5>???? {itemHolder.middle_cost} ??????.</h5>
                </div>

            </div>

                </Card.Body>
        </Card>
            <Card className={styles.contentBlock}>
                <Tabs defaultActiveKey="property" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="property" title="????????????????????????????">
                        <ItemProperty itemName={itemHolder.name}></ItemProperty>
                    </Tab>
                </Tabs>
            </Card>
        </div>
    );
};

export default ItemPage;
