package handlers

import (
	"fmt"
	"github.com/APTrust/easy-store/db/models"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	_ "github.com/mattn/go-sqlite3"
	"net/http"
	"net/url"
)

func JobGetForm(env *Environment, w http.ResponseWriter, r *http.Request) error {
	data := make(map[string]interface{})
	job, err := ParseJobRequest(env, http.MethodGet, r)
	if err != nil {
		return WrapErr(err)
	}
	form, err := job.Form(env.DB)
	if err != nil {
		return WrapErr(err)
	}
	data["form"] = form
	data["obj"] = job
	data["section"] = "files"
	return env.ExecTemplate(w, "job-form", data)
}

func JobPostForm(env *Environment, w http.ResponseWriter, r *http.Request) error {
	data := make(map[string]interface{})
	job, err := ParseJobRequest(env, http.MethodPost, r)
	if err != nil {
		return WrapErr(err)
	}

	// Save Bag and/or File first.

	if job.IsValid() {
		if job.ID == 0 {
			err = env.DB.Create(&job).Error
		} else {
			err = env.DB.Save(&job).Error
		}
		if err != nil {
			return WrapErr(err)
		} else {
			msg := fmt.Sprintf("Job has been saved")
			http.Redirect(w, r, "/jobs?success="+url.QueryEscape(msg), 303)
			return nil
		}
	}
	// Submitted data was not valid. Show the form with errors.
	form, err := job.Form(env.DB)
	if err != nil {
		return WrapErr(err)
	}
	data["form"] = form
	data["obj"] = job
	return env.ExecTemplate(w, "job-form", data)
}

func ParseJobRequest(env *Environment, method string, r *http.Request) (*models.Job, error) {
	id, formValues, err := ParseRequest(r)
	if err != nil {
		return nil, err
	}
	return models.JobFromRequest(env.DB, method, id, formValues)
}

// This is a crude job runner for our demo. Break this out later,
// add proper error handling, etc. And fix the models too.
// We should be able to preload, instead of getting related ids
// and issuing new queries.
// func JobRun(env *Environment, w http.ResponseWriter, r *http.Request) error {
// 	data := make(map[string]interface{})
// 	errMsg := ""
// 	err := r.ParseForm()
// 	if err != nil {
// 		return errors.WithStack(err)
// 	}

// 	// Gather the info we need to create the bag
// 	workflowId, _ := strconv.Atoi(r.PostFormValue("WorkflowID"))
// 	workflow := &models.Workflow{}
// 	env.DB.Find(&workflow, workflowId)

// 	profile := &models.BagItProfile{}
// 	env.DB.Preload("DefaultTagValues").Find(&profile, workflow.BagItProfileID)

// 	storageService := &models.StorageService{}
// 	env.DB.Find(&storageService, workflow.StorageServiceID)

// 	stagingDir := models.AppSetting{}
// 	env.DB.Where("name = ?", "Staging Directory").First(&stagingDir)

// 	sourceDir := r.PostFormValue("SourceDir")
// 	// HACK for demo: add virginia.edu. as bag name prefix
// 	bagName := "virginia.edu." + filepath.Base(sourceDir)
// 	bagPath := filepath.Join(stagingDir.Value, bagName)
// 	bagCreated := ("Creating bag " + bagName + " in " + stagingDir.Value + " using profile " +
// 		profile.Name + "<br/>")
// 	bagItProfile, err := profile.Profile()
// 	if err != nil {
// 		errors.WithStack(err)
// 	}

// 	// Create the bag by copying the files into a staging dir,
// 	// adding tags and manifests.
// 	bagCreated += "<h3>Files</h3>"
// 	bagger, err := bagit.NewBagger(bagPath, bagItProfile)
// 	sourceFiles, _ := fileutil.RecursiveFileList(sourceDir)
// 	relDestPaths := make([]string, len(sourceFiles))
// 	for i, absSrcPath := range sourceFiles {
// 		// Use forward slash, even on Windows, for path of file inside bag
// 		origPathMinusRootDir := strings.Replace(absSrcPath, sourceDir+"/", "", 1)
// 		relDestPath := fmt.Sprintf("data/%s", origPathMinusRootDir)
// 		bagger.AddFile(absSrcPath, relDestPath)
// 		relDestPaths[i] = relDestPath
// 		bagCreated += ("Adding file " + absSrcPath + " at " + relDestPath + "<br/>")
// 	}
// 	bagCreated += "<br/>"

// 	// This adds the tags from the profile's default tag values.
// 	// In reality, several of the tags cannot come from general
// 	// defaults, because they're bag-specific. E.g. Title,
// 	// Description, Access, etc.
// 	bagCreated += "<h3>Tags</h3>"
// 	for _, dtv := range profile.DefaultTagValues {
// 		keyValuePair := &bagit.KeyValuePair{
// 			Key:   dtv.TagName,
// 			Value: dtv.TagValue,
// 		}
// 		bagger.AddTag(dtv.TagFile, keyValuePair)
// 		bagCreated += ("Adding tag " + dtv.TagName + " to file " + dtv.TagFile + "<br/>")
// 	}
// 	bagCreated += "<br/>"

// 	// Now that the bagger knows what to do, WriteBag() tells it to
// 	// go ahead and write out all the contents to the staging area.
// 	overwriteExistingBag := true
// 	checkRequiredTags := true
// 	bagger.WriteBag(overwriteExistingBag, checkRequiredTags)
// 	if len(bagger.Errors()) > 0 {
// 		for _, msg := range bagger.Errors() {
// 			errMsg += fmt.Sprintf("%s <br/>", msg)
// 		}
// 	} else {
// 		bagCreated += ("Bag was written to " + bagPath + "\n\n")
// 	}

// 	manifestPath := filepath.Join(bagPath, "manifest-md5.txt")
// 	if fileutil.FileExists(manifestPath) {
// 		manifestData, err := ioutil.ReadFile(manifestPath)
// 		if err != nil {
// 			return errors.WithStack(err)
// 		} else {
// 			data["Manifest"] = string(manifestData)
// 		}
// 	}

// 	aptPath := filepath.Join(bagPath, "aptrust-info.txt")
// 	if fileutil.FileExists(aptPath) {
// 		aptData, err := ioutil.ReadFile(aptPath)
// 		if err != nil {
// 			return errors.WithStack(err)
// 		} else {
// 			data["APTrustInfo"] = string(aptData)
// 		}
// 	}

// 	bagInfoPath := filepath.Join(bagPath, "bag-info.txt")
// 	if fileutil.FileExists(bagInfoPath) {
// 		bagInfoData, err := ioutil.ReadFile(bagInfoPath)
// 		if err != nil {
// 			return errors.WithStack(err)
// 		} else {
// 			data["BagInfo"] = string(bagInfoData)
// 		}
// 	}

// 	// Tar the bag, if the Workflow config says to do that.
// 	// In the future, we may support formats other than tar.
// 	// Also, we will likely have to supply our own tar program
// 	// because Windows users won't have one.
// 	bagPathForValidation := bagPath
// 	tarFileName := fmt.Sprintf("%s.tar", bagName)
// 	if workflow.SerializationFormat == "tar" {
// 		cleanBagPath := bagPath
// 		if strings.HasSuffix(bagPath, string(os.PathSeparator)) {
// 			// Chop off final path separator, so call to filepath.Dir
// 			// below will return the parent dir name.
// 			cleanBagPath = bagPath[0 : len(bagPath)-1]
// 		}
// 		workingDir := filepath.Dir(cleanBagPath)
// 		tarFileAbsPath := filepath.Join(workingDir, tarFileName)
// 		bagCreated += ("Tarring bag to " + tarFileAbsPath + "\n")
// 		//cmd := exec.Command("tar", "cf", tarFileName, "--directory", bagName)
// 		cmd := exec.Command("tar", "cf", tarFileName, bagName)
// 		cmd.Dir = workingDir
// 		commandOutput, err := cmd.CombinedOutput()
// 		if err != nil {
// 			return errors.WithStack(err)
// 		}
// 		bagCreated += fmt.Sprintf("%s <br/><br/>", string(commandOutput))
// 		bagPathForValidation = tarFileAbsPath
// 	}

// 	// Validate the bag, just to make sure...
// 	bagCreated += "<h3>Validation</h3>"
// 	bagCreated += "Validating bag...<br/>"
// 	bag := bagit.NewBag(bagPathForValidation)
// 	validator := bagit.NewValidator(bag, bagItProfile)
// 	validator.ReadBag()
// 	if len(validator.Errors()) > 0 {
// 		for _, e := range validator.Errors() {
// 			errMsg += fmt.Sprintf("%s <br/>", e)
// 		}
// 	} else {
// 		bagCreated += ("Bag is valid <br/>")
// 		if fileutil.LooksSafeToDelete(bagPath, 15, 3) {
// 			os.RemoveAll(bagPath)
// 			bagCreated += "Deleting working directory, kept tar file. <br/>"
// 		}
// 	}

// 	data["BagName"] = bagName
// 	data["BagCreated"] = template.HTML(bagCreated)

// 	// If the config includes an S3 upload, do that now.
// 	// Use the minio client from https://minio.io/downloads.html#minio-client
// 	// Doc is at https://docs.minio.io/docs/minio-client-complete-guide
// 	// We're checking for S3, because this step is for demo only, and
// 	// s3 is the only storage service we've implemented.
// 	if storageService != nil && storageService.Protocol == "s3" {
// 		// Hack for demo: get S3 keys out of the environment.
// 		accessKeyID := os.Getenv("AWS_ACCESS_KEY_ID")
// 		secretAccessKey := os.Getenv("AWS_SECRET_ACCESS_KEY")
// 		useSSL := true
// 		minioClient, err := minio.New(storageService.URL, accessKeyID, secretAccessKey, useSSL)
// 		if err != nil {
// 			return errors.WithStack(err)
// 		}
// 		n, err := minioClient.FPutObject(storageService.BucketOrFolder,
// 			tarFileName, // we're assuming the tar file was made for this demo
// 			bagPathForValidation,
// 			minio.PutObjectOptions{ContentType: "application/x-tar"})
// 		if err != nil {
// 			errMsg += ("Error uploading tar file to S3: " + err.Error() + "<br/>")
// 		} else {
// 			msg := fmt.Sprintf("Successfully uploaded %s of size %d to receiving bucket.", tarFileName, n)
// 			data["UploadResult"] = template.HTML(msg + "<br/>")
// 		}
// 	}

// 	if errMsg != "" {
// 		data["Error"] = template.HTML(errMsg)
// 	}

// 	return env.ExecTemplate(w, "job-result", data)
// }
