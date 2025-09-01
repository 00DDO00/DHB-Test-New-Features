import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";

import {
  Alert as MuiAlert,
  Checkbox,
  FormControlLabel,
  Button,
  TextField as MuiTextField,
} from "@mui/material";
import { spacing } from "@mui/system";

import useAuth from "../../hooks/useAuth";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)<{ my?: number }>(spacing);

function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  return (
    <Formik
      initialValues={{
        email: "demo@bootlab.io",
        password: "unsafepassword",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Must be a valid email")
          .max(255)
          .required("Email is required"),
        password: Yup.string().max(255).required("Password is required"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await signIn(values.email, values.password);

          navigate("/private");
        } catch (error: any) {
          const message = error.message || "Something went wrong";

          setStatus({ success: false });
          setErrors({ submit: message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form 
          noValidate 
          onSubmit={handleSubmit}
          role="form"
          aria-label="Sign in to your account"
        >
          <Alert 
            mt={3} 
            mb={3} 
            severity="info"
            role="status"
            aria-label="Demo credentials information"
          >
            Use <strong>demo@bootlab.io</strong> and{" "}
            <strong>unsafepassword</strong> to sign in
          </Alert>
          {errors.submit && (
            <Alert 
              mt={2} 
              mb={3} 
              severity="warning"
              role="alert"
              aria-live="polite"
            >
              {errors.submit}
            </Alert>
          )}
          <TextField
            type="email"
            name="email"
            label="Email Address"
            value={values.email}
            error={Boolean(touched.email && errors.email)}
            fullWidth
            helperText={touched.email && errors.email}
            onBlur={handleBlur}
            onChange={handleChange}
            my={2}
            aria-required="true"
            aria-describedby={touched.email && errors.email ? "email-error" : undefined}
          />
          <TextField
            type="password"
            name="password"
            label="Password"
            value={values.password}
            error={Boolean(touched.password && errors.password)}
            fullWidth
            helperText={touched.password && errors.password}
            onBlur={handleBlur}
            onChange={handleChange}
            my={2}
            aria-required="true"
            aria-describedby={touched.password && errors.password ? "password-error" : undefined}
          />
          <FormControlLabel
            control={
              <Checkbox 
                value="remember" 
                color="primary"
                aria-describedby="remember-me-description"
              />
            }
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            aria-label={isSubmitting ? "Signing in..." : "Sign in to your account"}
          >
            Sign in
          </Button>
          <Button
            component={Link}
            to="/auth/reset-password"
            fullWidth
            color="primary"
            aria-label="Go to password reset page"
          >
            Forgot password
          </Button>
        </form>
      )}
    </Formik>
  );
}

export default SignIn;
