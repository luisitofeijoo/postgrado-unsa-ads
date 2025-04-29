import React, {useEffect, useState, useRef} from 'react';
import AvatarEditor from 'react-avatar-editor';

export default function UploadFotoPersona ({ onImageCropped, imagenPredeterminada = "/img/personas/default.jpg" , borderRadius=0}) {
    const editorAvatar = useRef(null);
    const fileImageRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [avatarScale, setAvatarScale] = useState(1.5);
    const [avatarImgEditor, setAvatarImgEditor] = useState(null);
    const [avatar, setAvatar] = useState(null);

    // Sincronizar el estado local con la prop imagenPredeterminada utilizando useEffect
    useEffect(() => {
        setAvatar(imagenPredeterminada);
    }, [imagenPredeterminada]);

    const handleScale = (e) => {
        const scale = parseFloat(e.target.value)
        setAvatarScale(scale);
    }

    const handleModalClose = () => {
        setModalOpen(false);
    }

    const openCropEditor = (e) => {
        fileImageRef.current.click();
    }
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            event.target.value = null; // Restablecer el valor del campo de entrada de archivos
            setModalOpen(true);
            setAvatarImgEditor(file); //Cargamos la imagen cargada al editor para cropear
        }
    };

    const handleGuardarCrop = async () => {
        if(editorAvatar) {
            const dataUrl = editorAvatar.current?.getImageScaledToCanvas().toDataURL('image/jpeg', 0.9); //BASE64 url
           // const dataUrl = editorAvatar.current?.getImage().toDataURL();
   /*         const result = await fetch(dataUrl);
            const blob = await result.blob();*/
            setAvatar(dataUrl);
            /*onImageCropped(new File([blob], "imagen.png", {
                type: blob.type,
            }));*/
            onImageCropped(dataUrl);
            handleModalClose();
        }
    }


    return (<>
        <div className={`modal ${modalOpen ? 'is-active' : ''}`}>
                <div className="modal-background"></div>
                <div className="modal-card" style={{maxWidth:"300px"}}>
                    <header className="modal-card-head modal-title-card">
                        <p className="modal-card-title">Recorte de foto</p>
                        <a onClick={handleModalClose} ><i className="far fa-xmark has-text-white"></i></a>
                    </header>
                    <section className="modal-card-body has-text-centered pb-0">
                        <AvatarEditor
                            ref={editorAvatar}
                            image={avatarImgEditor}
                            width={160}
                            height={(borderRadius===0)?224:160}
                            border={[50,20]}
                            borderRadius={130/(100/borderRadius)}
                            scale={avatarScale}
                            color={[0, 0, 0, 0.5]} // RGBA
                            rotate={0}
                        />
                        <div>
                            <input
                                type="range"
                                onChange={handleScale}
                                min="1"
                                max="3"
                                step="0.01"
                                defaultValue="1.5"
                            />
                        </div>
                    </section>
                    <section className="modal-card-foot has-background-grey-lighter is-block">
                        <div className="columns">
                            <div className="column"><a className="button is-light is-fullwidth" onClick={handleModalClose}>Cancelar</a></div>
                            <div className="column"><a className="button is-primary is-fullwidth" onClick={handleGuardarCrop}>Recortar</a></div>
                        </div>
                    </section>
                </div>
            </div>
            <div className="profile-picture">
                <img src={avatar} alt="Imagen de perfil" style={{borderRadius: borderRadius===0? '0%': '50%', height: borderRadius===0 ? '180px': '128px'}}/>
                <div className="button-upload-photo" onClick={openCropEditor}>
                    <i className="fad fa-camera"></i>
                </div>
                <input
                    type="file"
                    style={{ display: 'none' }}
                    ref={fileImageRef}
                    accept=".jpg, .jpeg, .png"
                    onChange={handleFileInputChange}
                />
            </div>
    </>);
}
