import React, { useState, useEffect } from "react";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Card,
  Divider,
  message,
  Modal,
  Upload,
  Image,
  Button,
  Segmented,
  Input,
} from "antd";
import "./images.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const { Meta } = Card;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Images = () => {
  const navigate = useNavigate();
  const [groupValue, setGroupValue] = useState("All");
  const [groupName, setGroupName] = useState("");
  const [groupData, setGroupData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState([]);
  const [isUploading, setIsUploading] = useState(undefined);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [groups, setGroups] = useState(["All"]);

  const setGroup = (val) => {
    setGroupValue(val);
    let gData = [];
    data.forEach((element) => {
      if (element.group === val || val === "All") {
        gData.push(element);
      }
    });
    setGroupData(gData);
  };

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "image/gif";
    if (!isJpgOrPng) {
      message.error("You can only upload JPEG/JPG//PNG/GIF file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error("Image must smaller than 5MB!");
    }
    return isLt2M && isJpgOrPng;
  };
  const handleChange = (info) => {
    setFileList([...info.fileList]);
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const setImageData = (response) => {
    let newData = [];
    let group = ["All"];
    response.forEach((element) => {
      if (element.title != null && element.title.startsWith("image_")) {
        if (element.group !== "" && !group.includes(element.group)) {
          group.push(element.group);
        }
        if (element.note.startsWith("<p>")) {
          let len = element.note.length;
          element.note = element.note.substring(3, len - 4);
        }
        element.title = element.title.substr(6);
        newData.push(element);
      }
    });
    setGroups([...group]);
    setGroupData([...newData]);
    setGroupValue("All");
    return newData;
  };

  useEffect(() => {
    if (
      Cookies.get("accessToken") === undefined ||
      Cookies.get("refreshToken") === undefined
    ) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      navigate("/login");
    } else {
      setIsSubmitting(true);
      fetch("https://trackdsa.com/auth/verifyaccess", {
        method: "POST",
        body: JSON.stringify({
          accessToken: Cookies.get("accessToken"),
          refreshToken: Cookies.get("refreshToken"),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then(async (response) => {
          if (response.status >= 200 && response.status <= 299) {
            return response.json();
          } else {
            const text = await response.text();
            throw new Error(text);
          }
        })
        .then((data) => {
          if (data.accessToken !== false) {
            Cookies.set("accessToken", data.accessToken, {
              expires: 7,
              path: "",
            });
            fetch(`https://trackdsa.com/problems/getnotes/${data.userid}`)
              .then(async (response) => {
                if (response.status >= 200 && response.status <= 299) {
                  return response.json();
                } else {
                  const text = await response.text();
                  throw new Error(text);
                }
              })
              .then((data) => {
                setIsSubmitting(false);
                setData(setImageData(data.totalnote));
              })
              .catch((err) => {
                setIsSubmitting(false);
                message.error(
                  "Sorry!!! Server is busy. Please try again later",
                  5
                );
              });
          } else {
            message.error("Please login to view notes", 5);
            setIsSubmitting(false);
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            navigate("/login");
          }
        })
        .catch((err) => {
          setIsSubmitting(false);
          message.error("Please login to view notes", 5);
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          navigate("/login");
        });
    }
  }, [navigate]);

  const handleUpload = () => {
    if (fileList) {
      setIsUploading(true);
      fetch("https://trackdsa.com/auth/verifyaccess", {
        method: "POST",
        body: JSON.stringify({
          accessToken: Cookies.get("accessToken"),
          refreshToken: Cookies.get("refreshToken"),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then(async (response) => {
          if (response.status >= 200 && response.status <= 299) {
            return response.json();
          } else {
            const text = await response.text();
            throw new Error(text);
          }
        })
        .then((data) => {
          if (data.accessToken !== false) {
            Cookies.set("accessToken", data.accessToken, {
              expires: 7,
              path: "",
            });
            let obj = {};
            obj.userid = data.userid;
            let notes = [];
            for (let i = 0; i < fileList.length; i++) {
              if (
                fileList[0].status !== undefined &&
                fileList[0].status === "done"
              ) {
                notes.push({
                  title: "image_" + fileList[i].response.original_filename,
                  note: fileList[i].response.secure_url,
                  group: groupName,
                });
              }
            }
            if (notes.length > 0) {
              obj.notes = notes;
              fetch("https://trackdsa.com/problems/addnote", {
                method: "POST",
                body: JSON.stringify(obj),
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
              })
                .then(async (response) => {
                  if (response.status >= 200 && response.status <= 299) {
                    return response.json();
                  } else {
                    const text = await response.text();
                    throw new Error(text);
                  }
                })
                .then((data) => {
                  setIsUploading(false);
                  setFileList([]);
                  setData(setImageData(data.totalnote));
                  setGroupName("");
                })
                .catch((err) => {
                  setIsUploading(false);
                  message.error(err.message, 5);
                });
            } else {
              setIsUploading(false);
              setFileList([]);
            }
          } else {
            message.error("Please login to view problems", 5);
            navigate("/login");
          }
        })
        .catch((err) => {
          setIsUploading(false);
          message.error(err.message, 5);
        });
    }
  };

  const confirmDelete = (values) => {
    setIsSubmitting(true);
    fetch("https://trackdsa.com/auth/verifyaccess", {
      method: "POST",
      body: JSON.stringify({
        accessToken: Cookies.get("accessToken"),
        refreshToken: Cookies.get("refreshToken"),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          const text = await response.text();
          throw new Error(text);
        }
      })
      .then((datas) => {
        if (datas.accessToken !== false) {
          Cookies.set("accessToken", datas.accessToken, {
            expires: 7,
            path: "",
          });
          let obj = {};
          obj.userid = datas.userid;
          obj._id = values._id;
          fetch("https://trackdsa.com/problems/deletenote", {
            method: "DELETE",
            body: JSON.stringify(obj),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then(async (response) => {
              if (response.status >= 200 && response.status <= 299) {
                return response.json();
              } else {
                const text = await response.text();
                throw new Error(text);
              }
            })
            .then((data) => {
              setIsSubmitting(false);
              message.success("Data has been deleted successfully", 3);
              setData(setImageData(data.totalnote));
            })
            .catch((err) => {
              setIsSubmitting(false);
              message.error(err.message, 5);
            });
        } else {
          message.success("Please login to view problems", 5);
          navigate("/login");
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        message.error(err.message, 5);
      });
  };
  return (
    <div className="imagediv_cont">
      <div>
        <Upload
          action="https://api.cloudinary.com/v1_1/mayur28/image/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          data={{ upload_preset: "juxso4ls" }}
          beforeUpload={beforeUpload}
          multiple={{
            previewIcon: true,
            downloadIcon: true,
            removeIcon: true,
          }}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Input
          value={groupName}
          showCount
          maxLength={10}
          onChange={(e) => setGroupName(e.target.value)}
          size="small"
          style={{ width: 150 }}
        />
        <Button
          size="small"
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0}
          loading={isUploading}
          style={{ width: 150, display: "block", marginTop: 16 }}
        >
          {isUploading ? "Uploading" : "Start Upload"}
        </Button>
      </div>
      <div>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img
            alt="uploaded_image"
            style={{ width: "100%" }}
            src={previewImage}
          />
        </Modal>
      </div>
      <Divider>Uploaded Images</Divider>
      {groups.length > 0 && (
        <Segmented
          block
          options={groups}
          value={groupValue}
          onChange={setGroup}
        />
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        {groupData.length > 0 &&
          groupData.map((val, index) => (
            <Card
              actions={[
                <DeleteOutlined
                  key="delete"
                  onClick={() => confirmDelete(val)}
                />,
              ]}
              style={{ width: "200px" }}
              key={index}
              cover={<Image width={180} height={200} src={val.note} />}
            >
              <Meta
                title={val.title}
                style={{ height: "30px", width: "180px" }}
              />
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Images;
