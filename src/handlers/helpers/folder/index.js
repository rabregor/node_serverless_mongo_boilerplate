import { createUUID } from "../../../utils/functions.js";
import responses from "../../../utils/responses.js";
import * as models from "../../../models/index.js";

export const getAllFolders = async (_, { user }) => {
  if (user.type !== "admin") {
    try {
      /*
      const orgFolders = await models.Folder.query("organization")
        .eq(user.organization)
        .exec();
      */

      const orgFolders = await models.Folder.find({ organization: user.organization });

      if (orgFolders.length > 0) {
        for (const folder of orgFolders) {
          /*
          const requirements = await models.Requirement.query("folder")
            .using("FolderIndex")
            .eq(folder.id)
            .exec();
          */
         const requirements = await models.Requirement.find({ folder: folder.id });

          if (requirements.length > 0) {
            folder.requirements = requirements;
            for (const requirement of folder.requirements) {
              if (requirement.file !== "" && requirement.folder !== "") {
                console.log(requirement.file, requirement.folder);
                /*
                const file = await models.File.get({
                  id: requirement.file,
                  folder: requirement.folder,
                });
                */
                const file = await models.File.findOne({
                  _id: requirement.file,
                  folder: requirement.folder,
                });

                requirement.file = file ? file : null;
              }
            }
          } else {
            folder.requirements = [];
          }
        }
      }
      return responses.success("folders", orgFolders);
    } catch (error) {
      console.error("Failed to query folders:", error);
      return responses.internalError("Failed to fetch folders.");
    }
  }
  try {
    // const folders = await models.Folder.scan().exec();
    const folders = await models.Folder.find({});
    if (folders.length > 0) {
      for (const folder of folders) {
        /*
        const requirements = await models.Requirement.query("folder")
          .using("FolderIndex")
          .eq(folder.id)
          .exec();
        */
        const requirements = await models.Requirement.find({ folder: folder.id });

        if (requirements.length > 0) {
          folder.requirements = requirements;
          for (const requirement of folder.requirements) {
            if (requirement.file !== "" && requirement.folder !== "") {
              /*
              const file = await models.File.get({
                id: requirement.file,
                folder: requirement.folder,
              });
              */

              const file = await models.File.findOne({
                _id: requirement.file,
                folder: requirement.folder,
              });

              requirement.file = file ? file : null;
            }
          }
        } else {
          folder.requirements = [];
        }
      }
    }

    return responses.success("folders", folders);
  } catch (error) {
    console.error("Failed to query folders:", error);
    return responses.internalError("Failed to fetch folders.");
  }
};

export const getFolderById = async ({
  pathParameters: { id, organization },
}) => {
  
  // const folder = await models.Folder.get({ organization, id });

  const folder = await models.Folder.findOne({ id, organization });

  if (!folder) {
    return responses.notFound("Folder");
  }
  if (folder) {
    /*
    const requirements = await models.Requirement.query("folder")
      .using("FolderIndex")
      .eq(folder.id)
      .exec();
    */
    const requirements = await models.Requirement.find({ folder: folder.id});
    
    // const files = await models.File.query("folder").eq(folder.id).exec();
    const files = await models.File.find({ folder: folder.id });

    folder.requirements = requirements.length > 0 ? requirements : [];
    folder.files = files.length > 0 ? files : [];
    return responses.success("folder", folder);
  }
};

export const createFolder = async ({ body }) => {
  try {
    const {
      folder: { name, organization },
      requirements,
      files,
    } = body;
    const folderId = createUUID();

    const newFolder = new models.Folder({
      id: folderId,
      name,
      organization,
    });

    await newFolder.save();

    if (requirements && Array.isArray(requirements)) {
      for (const req of requirements) {
        const requirementId = createUUID();
        const newRequirement = new models.Requirement({
          id: requirementId,
          folder: folderId,
          ...req,
          organization,
        });
        await newRequirement.save();
      }
    }

    if (files && Array.isArray(files)) {
      for (const file of files) {
        const fileId = createUUID();
        const newFile = new models.File({
          folder: folderId,
          id: fileId,
          organization,
          ...file,
        });
        await newFile.save();
      }
    }

    return responses.created("folder", {
      folder: { ...newFolder, requirements },
    });
  } catch (error) {
    console.log(error);
    return responses.internalError("Failed to create folder");
  }
};

export const updateFolder = async ({
  pathParameters: { id, organization },
  body,
}) => {
  try {
    if (!id) {
      return responses.badRequest("Missing folder id");
    }
    const { name, organization: updateOrg, status } = body;

    // const folderToUpdate = await models.Folder.get({ id, organization });
    const folderToUpdate = await models.Folder.findOne({ id, organization });

    if (!folderToUpdate) {
      return responses.notFound("Folder");
    }

    folderToUpdate.name = name ?? folderToUpdate.name;
    folderToUpdate.organization = updateOrg ?? folderToUpdate.organization;
    folderToUpdate.status = status ?? folderToUpdate.status;

    const updatedFolder = await folderToUpdate.save();

    return responses.success("folder", updatedFolder);
  } catch (err) {
    console.log(err);
    return responses.internalError("Failed to update folder");
  }
};
