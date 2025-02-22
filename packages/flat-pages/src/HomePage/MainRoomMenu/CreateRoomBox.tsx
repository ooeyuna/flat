import "./CreateRoomBox.less";

import React, { useContext, useEffect, useRef, useState, KeyboardEvent } from "react";
import { observer } from "mobx-react-lite";
import { Button, Input, Modal, Checkbox, Form, InputRef } from "antd";
import { RoomType } from "@netless/flat-server-api";
import { PreferencesStoreContext, GlobalStoreContext } from "../../components/StoreProvider";
import { useSafePromise } from "../../utils/hooks/lifecycle";
import { ClassPicker, HomePageHeroButton, Region } from "flat-components";
import { useTranslate } from "@netless/flat-i18n";

interface CreateRoomFormValues {
    roomTitle: string;
    roomType: RoomType;
    autoMicOn: boolean;
    autoCameraOn: boolean;
}

export interface CreateRoomBoxProps {
    onCreateRoom: (title: string, type: RoomType, region: Region) => Promise<void>;
}

export const CreateRoomBox = observer<CreateRoomBoxProps>(function CreateRoomBox({ onCreateRoom }) {
    const t = useTranslate();
    const sp = useSafePromise();
    const globalStore = useContext(GlobalStoreContext);
    const preferencesStore = useContext(PreferencesStoreContext);
    const [form] = Form.useForm<CreateRoomFormValues>();

    const [isLoading, setLoading] = useState(false);
    const [isShowModal, showModal] = useState(false);
    const [isFormValidated, setIsFormValidated] = useState(false);

    // @TODO: need to remove region from preferences store
    const [roomRegion] = useState<Region>(preferencesStore.getRegion());

    const [classType, setClassType] = useState<RoomType>(RoomType.BigClass);
    const roomTitleInputRef = useRef<InputRef>(null);

    const defaultValues: CreateRoomFormValues = {
        roomTitle: globalStore.userInfo?.name
            ? t("create-room-default-title", { name: globalStore.userInfo.name })
            : "",
        roomType: RoomType.BigClass,
        autoMicOn: preferencesStore.autoMicOn,
        autoCameraOn: preferencesStore.autoCameraOn,
    };

    useEffect(() => {
        let ticket = NaN;
        if (isShowModal) {
            // wait a cycle till antd modal updated
            ticket = window.setTimeout(() => {
                if (roomTitleInputRef.current) {
                    roomTitleInputRef.current.focus();
                    roomTitleInputRef.current.select();
                }
            }, 0);
        }
        return () => {
            window.clearTimeout(ticket);
        };
    }, [isShowModal]);

    return (
        <>
            <HomePageHeroButton
                type="begin"
                onClick={() => {
                    form.setFieldsValue(defaultValues);
                    showModal(true);
                    formValidateStatus();
                }}
            />
            <Modal
                forceRender // make "form" usable
                footer={[
                    <Button key="cancel" onClick={handleCancel}>
                        {t("cancel")}
                    </Button>,
                    <Button
                        key="submit"
                        disabled={!isFormValidated}
                        loading={isLoading}
                        type="primary"
                        onClick={handleOk}
                    >
                        {t("begin")}
                    </Button>,
                ]}
                open={isShowModal}
                title={t("home-page-hero-button-type.begin")}
                width={400}
                wrapClassName="create-room-box-container"
                onCancel={handleCancel}
                onOk={handleOk}
            >
                <Form
                    className="main-room-menu-form"
                    form={form}
                    initialValues={defaultValues}
                    layout="vertical"
                    name="createRoom"
                    onFieldsChange={formValidateStatus}
                >
                    <Form.Item
                        label={t("theme")}
                        name="roomTitle"
                        rules={[
                            { required: true, message: t("enter-room-theme") },
                            { max: 50, message: t("theme-can-be-up-to-50-characters") },
                        ]}
                    >
                        <Input
                            ref={roomTitleInputRef}
                            placeholder={t("enter-room-theme")}
                            onKeyUp={submitOnEnter}
                        />
                    </Form.Item>
                    <Form.Item label={t("type")} name="roomType" valuePropName="type">
                        <ClassPicker value={classType} onChange={e => setClassType(RoomType[e])} />
                    </Form.Item>
                    <Form.Item label={t("join-options")}>
                        <Form.Item noStyle name="autoMicOn" valuePropName="checked">
                            <Checkbox>{t("turn-on-the-microphone")}</Checkbox>
                        </Form.Item>
                        <Form.Item noStyle name="autoCameraOn" valuePropName="checked">
                            <Checkbox>{t("turn-on-the-camera")}</Checkbox>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );

    function submitOnEnter(ev: KeyboardEvent<HTMLInputElement>): void {
        if (ev.key === "Enter" && !ev.ctrlKey && !ev.shiftKey && !ev.altKey && !ev.metaKey) {
            ev.preventDefault();
            sp(form.validateFields()).then(handleOk);
        }
    }

    async function handleOk(): Promise<void> {
        try {
            await sp(form.validateFields());
        } catch (e) {
            // errors are displayed on the form
            return;
        }

        setLoading(true);

        try {
            const values = form.getFieldsValue();
            preferencesStore.updateAutoCameraOn(values.autoCameraOn);
            await sp(onCreateRoom(values.roomTitle, values.roomType, roomRegion));
            setLoading(false);
            showModal(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    function handleCancel(): void {
        showModal(false);
    }

    function formValidateStatus(): void {
        setIsFormValidated(form.getFieldsError().every(field => field.errors.length <= 0));
        const values = form.getFieldsValue();
        preferencesStore.updateAutoMicOn(values.autoMicOn);
        preferencesStore.updateAutoCameraOn(values.autoCameraOn);
    }
});

export default CreateRoomBox;
