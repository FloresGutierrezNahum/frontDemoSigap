import React, { Component } from 'react';
import { Modal, ModalFooter, ModalHeader, ModalBody, Button, Label, Input } from 'reactstrap';
//import {Modal,ModalManager,Effect} from 'react-dynamic-modal';
import './css/bootstrap.css';
import URL from "./API/API";
import swal from 'sweetalert';
import ReactDOM from 'react-dom';
import Listardatos from './ListarComprobantes';

class ModalAsignar extends Component {

    constructor(props) {
        super(props);
        this.handlerGuardar = this.handlerGuardar.bind(this);
        this.close = this.close.bind(this);
        this.texto = React.createRef();
        this.state = {
            modal: false,
            codigoAlumno: this.props.alumno[0]?this.props.alumno[0].cod_alumno:"",
            programa: this.props.id_programa,
            alumno:this.props.alumno,
            apepat: this.props.alumno[0]?this.props.alumno[0].ape_paterno:"",
            apemat: this.props.alumno[0]?this.props.alumno[0].ape_materno:"",
            names: this.props.alumno[0]?this.props.alumno[0].nom_alumno:"",
            recibo: this.props.recibo?this.props.recibo:"",
            nombreCompleto: this.props.nombre?this.props.nombre:"",
            id_alum: this.props.id_alum,
            alumnos:[]
        }
        
        this.handleInputName = this.handleInputName.bind(this);
        this.handleInputIngreso = this.handleInputIngreso.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.asignarAlumno = this.asignarAlumno.bind(this);
        this.handleInputNames = this.handleInputNames.bind(this);
        this.handleInputApepat = this.handleInputApepat.bind(this);
        this.handleInputApemat = this.handleInputApemat.bind(this);
        this.handleInputDni = this.handleInputDni.bind(this);
    }

    componentWillMount() {
        this.setState({
            modal: this.props.estado
        })
    }
    handlerGuardar() {
        let data = this.texto.current.value;
        // console.log(data);
        this.props.change(data, this.props.id_rec);
        //  ModalManager.close();
        this.setState({
            modal: false
        })
    }
    close() {
        this.setState({
            modal: false
        })
    }

    //--------------- FUNCIONES PARA TRAER DATOS DE LA API
    getProgramas() {
        let url = URL.url.concat("programas");
        console.log(url);
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.status) {
                    this.setState({
                        programas: res.data
                    })
                } else {
                    console.log("error");
                }
            });
    }

    getDatosAlumno() {
        console.log("ni funciona");
        console.log(this.props);
        let url = URL.url.concat("alumnos/" + this.props.recibo);
        console.log(url);
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.status) {
                    this.setState({
                        alumno: res.data
                    })
                } else {
                    console.log("error");
                }
            });
    }

    /////////////////////////////////////////////
    /////////////////////////////////////////////
    /////////////////////////////////////////////
    //Nuevas funciones para traer datos de la API
    fnMostrarAsignacionesDisponibles(){
        console.log(this.props);
        let url = URL.url.concat("asignacionesDisponibles");
        //Variables de Json
        let nombre = (this.state.names).toUpperCase();
        let app_pat = (this.state.apepat).toUpperCase();
        let app_mat = (this.state.apemat).toUpperCase();
        let codigo = this.state.codigoAlumno;
        let dni = this.state.dni;

        console.log(JSON.stringify({
            nombre: nombre,
            app_pat: app_pat,
            app_mat: app_mat,
            codigo: codigo,
            dni: dni
        }));
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                app_pat: app_pat,
                app_mat: app_mat,
                codigo: codigo,
                dni: dni
            })

        }).then(res => {
            return res.json();
        }).then(res => {
            console.log(res);
            /**************Al abrir el modal me sale un warn y no puedo mostrar los datos*************/
            
            this.setState({
                alumnos: res.data //todos los datos
            });
            
        });

    }

    //La ruta para asignar está aqui 
    //--> router.post('/asignarCodigoPrograma', algrmts.fnAsignarCodigoAlumnoIdPrograma);
    /*
    Usa este JSON
    {
	"cod_alumno": "12980989",
	"id_programa": "2",
	"numero_recibo": "10287706"
    }

    */


    
    //Funcion de asignación - v.Anterior
    asignarAlumno() {
            console.log(this.props);
            let url = URL.url.concat("asignarCodigoPrograma");

            console.log(JSON.stringify({
                cod_alumno: this.state.codigoAlumno, id_programa: this.state.programa,numero_recibo:this.state.recibo
            }));
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cod_alumno: this.state.codigoAlumno, id_programa: this.state.programa,numero_recibo:this.state.recibo
                })

            }).then(res => res.json())
                .then(res => {
                    console.log(res);
                    if (res.status === 'success') {
                        swal("Alumno asignado", "Los datos del alumno fueron asignados correctamente", {
                            icon: "success",
                            closeOnClickOutside: false
                        })
                            .then((asigned) => {
                                if (asigned) {
                                    // this.Listardatos.setState({data:[]});
                                    this.close();
                                }
                            });
                    } else {
                        swal("Alumno no asignado", "El alumno no pudo ser asignado", "error");
                    }
                });
      

    }

    editAsignacion() {
        let url = URL.url.concat("editAsignar");
        console.log(url);
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.status) {
                    this.setState({
                        programas: res.data
                    })
                } else {
                    console.log("error");
                }
            });
    }

 

    handleInputName(e) {
        this.setState({
            codigoAlumno: e.target.value
        });
        console.log(this.state);
    }

    handleSelect(e) {
        let telefonos = e.target.value.split("/");
        this.setState({
            codigoAlumno: parseFloat(telefonos[0]),
            programa: telefonos[1]
        });
        console.log(this.state);
        console.log(telefonos);
    }

    handleInputIngreso(e) {
        this.setState({
            ingreso: e.target.value
        });
        console.log(this.state);
    }

    handleInputNames(e){
        this.setState({
            names: e.target.value
        });
        console.log(this.state);
    }

    handleInputApepat(e){
        this.setState({
            apepat: e.target.value
        });
        console.log(this.state);
    }

    handleInputApemat(e){
        this.setState({
            apemat: e.target.value
        });
        console.log(this.state);
    }

    handleInputDni(e){
        this.setState({
            dni: e.target.value
        });
        console.log(this.state);
    }


    render() {

        console.log(this.state);

        const externalCloseBtn = <button className="close" style={{ position: 'absolute', top: '15px', right: '15px' }} onClick={this.close}>&times;</button>;
        return (
            <div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} external={externalCloseBtn}>
                    <ModalHeader>
                        <Label>Asignar</Label>
                    </ModalHeader>
                    <ModalBody>
                        <Label >Nombre registrado:</Label>
                        <Input value={this.state.nombreCompleto} type="text" className="form-control" disabled/>
                        <Label >Número de recibo:</Label>
                        <Input value={this.state.recibo} type="text" className="form-control" disabled/>
                        <Label >Código de alumno:</Label>
                        <Input value={this.state.codigoAlumno} onChange={this.handleInputName} type="text" className="form-control" placeholder="ingrese código del alumno" />
                        {/* {!this.props.codigoAlu ? <Label >Año de ingreso:</Label> : null}
                        {!this.props.codigoAlu ? <Input value={this.state.ingreso} onChange={this.handleInputIngreso} type="text" className="form-control" placeholder="ingrese año de ingreso" /> : null} */}
                        <Label >Nombres:</Label>
                        <Input value={this.state.names} type="text" onChange={this.handleInputNames} className="form-control"  placeholder="ingrese nombres"/>
                        <Label >Apellido paterno:</Label>
                        <Input value={this.state.apepat} type="text" onChange={this.handleInputApepat} className="form-control" placeholder="ingrese apellido paternos" />
                        <Label >Apellido materno:</Label>
                        <Input value={this.state.apemat} type="text" onChange={this.handleInputApemat} className="form-control" placeholder="ingrese apellido materno" />
                        

                        <Label >DNI:</Label>
                        <Input value={this.state.dni} type="text" onChange={this.handleInputDni} className="form-control"  placeholder="ingrese el DNI"/>
                        

                        <Button color="info" onClick={(e) => this.fnMostrarAsignacionesDisponibles()}>Buscar</Button>


                        <br></br>
                    {this.state.alumnos.length>0 ?<Label for="exampleSelectMulti">Resultados de busqueda:</Label>:null}                      
                       {/*  <Input value={this.state.programa} onChange={this.handleSelect} type="select" name="select" id="exampleSelect">
                        {
                            this.props.programas.map(programa => <option value={programa.id_programa} key={programa}> {programa.nom_programa} </option>)
                        }
                        </Input> */}
                      {this.state.alumnos.length>0 ?  <Input onChange={this.handleSelect} type="select" name="select" id="exampleSelect">
                        {
                            this.state.alumnos.map((alumno,index) => <option value={alumno.ids} key={index}> {alumno.campos_para_asignar} </option>)
                        }
                        </Input>:null}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.close}>Cerrar</Button>
                        <Button color="info" onClick={(e) =>  this.asignarAlumno()}>Asignar</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
export default ModalAsignar;