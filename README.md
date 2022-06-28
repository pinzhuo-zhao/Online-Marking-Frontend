## Project Overview
<pre>
Online marking system for tutors to easily mark oral presentations
The project is to develop a web-based application (React & Spring Boot) 
to allow tutors to 
    - Register/upload students to the system
    - Manage students based on their subjects/teams/assessments
    - Manage marking template for a presentation assessment
    - Provide individual and prompt grade/feedback to students taking a presentation assessment
    - Generate PDF/CSV feedback files and email to students 

</pre>

#### To Access the deployed version of the project
Frontend Server: https://fe-redback-fast-feedback.herokuapp.com/

Backend API server: https://rapid-feedback-fe-redback.herokuapp.com/swagger-ui.html

## Folder structure
```
.
├─src					        # Code
│  ├─FERedback_Backend			        # Backend Code
│  │  ├─src		       	                # Source code
│  │  │  ├─main			                # Java package structure
│  │  │  │  ├─java			        # Java package structure
│  │  │  │  │  └─com		                # Java package structure
│  │  │  │  │      └─feredback			# Java package structure
│  │  │  │  │          └─feredback_backend      # Java package structure
│  │  │  │  │              ├─config	        # Configuration files
│  │  │  │  │              ├─controller 	# Backend APIs to frontend
│  │  │  │  │              ├─entity		# Structure of objects
│  │  │  │  │              │  └─vo	        # Structure for frontend
│  │  │  │  │              ├─mapper	        # Mappers to connect database
│  │  │  │  │              ├─security		# Security Exception handling
│  │  │  │  │              ├─service		# Main backend functions
│  │  │  │  │              │  ├─ex	        # Exception handling
│  │  │  │  │              │  └─impl		# Main function code
│  │  │  │  │              └─util	        # Utility code
│  │  │  │  └─resources			        # Code related resource files
│  │  │  │      ├─csv		                # Store .csv file generated
│  │  │  │      ├─mybatis		        # Mybatis related files
│  │  │  │      │  └─mapper	                # Mybatis mapper for database
│  │  │  │      └─pdf		                # Store .pdf file generated
│  │  │  └─test			                # Test Code
│  │  │      └─java		                # Java structure for auto test
│  │  └─target			                # Generated binary file by Java
│  └─fe_redback_frontend				# Frontend code
│     ├─public							# Some static files
│     └─src								# Source code
│         ├─components					# Components contains header and side bar
│         └─pages						# A folder that contains all pages
│             ├─AddCoordinator			# Coordinator management page
│             ├─AddInstructor			# Instructor management page
│             ├─Home					# Home page that have some introduction
│             ├─Login					# Login page
│             ├─NotFound				# Error page
│             ├─Project					# Project management page
│             ├─Rubric					# Rubric management page
│             ├─SelectSubject			# Select subject page after login
│             ├─Student					# Student management page
│             ├─Subject					# Subject management page
│             └─Team					# Team management page
│         ├─App.css						# Overall style file
│         ├─App.js						# Include all pages and a router
│         ├─constant.jsx				# Include all backend API
│         ├─index.js					# Index page
```



## Current Branches

### Main
The branch for generating tags at the end of each sprint.

### Dev
The branch for development, all minor function branches will be merged into this dev branch after that function is finalized. 

### Other minor function related branches
Branches for developing each function.

## Branch and Commit Message Naming Convention 
### Branches
Branch names should reflect to the functions that is being developed in this branch, it should be merged to dev when it is completed and has been thoroughly tested. 

### Commit Messages
Commit messages should be succinct and reflect the major changes made in this commit.
