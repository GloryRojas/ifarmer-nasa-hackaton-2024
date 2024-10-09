import { Box, Button, Container, CssBaseline, TextField } from "@mui/material";
import { Autocomplete, GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";
import styles from "./GoogleMap.module.css";

const mapContainerStyle = {
	width: "100%",
	height: "100%",
};

const center = {
	lat: -12.0464, // Initial latitud (Lima, Perú)
	lng: -77.0428,
};

interface GoogleMapWithMarkerControlProps {
	onLocationChange: (location: google.maps.LatLng) => void;
}

const GoogleMapWithMarkerControl: React.FC<GoogleMapWithMarkerControlProps> = ({
	onLocationChange,
}) => {
	const [map, setMap] = useState<google.maps.Map | null>(null);
	const [selectedPosition, setSelectedPosition] =
		useState<google.maps.LatLngLiteral | null>(null);
	const [isMarkerMode, setIsMarkerMode] = useState(false);
	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
	const [literalLocation, setLiteralLocation] = 
    useState<google.maps.LatLng>(new google.maps.LatLng(center.lat, center.lng));


	const handleLoadMap = (mapInstance: google.maps.Map) => {
		setMap(mapInstance);
	};

	const handlePlaceChanged = useCallback(() => {
		const place = autocompleteRef.current?.getPlace();
		if (place?.geometry) {
			const location = place.geometry.location;
			const newCenter = {
				lat: location.lat(),
				lng: location.lng(),
			};
			setLiteralLocation(location);
			setSelectedPosition(newCenter);
			map?.panTo(newCenter);
		}
	}, [map]);

	const handleLoadAutocomplete = (
		autocompleteInstance: google.maps.places.Autocomplete,
	) => {
		autocompleteRef.current = autocompleteInstance;
	};

	const handleMapClick = (event: google.maps.MapMouseEvent) => {
		if (isMarkerMode && event.latLng) {
			const newPosition = {
				lat: event.latLng.lat(),
				lng: event.latLng.lng(),
			};
			setSelectedPosition(newPosition);
			setIsMarkerMode(false);
		}
	};

	const handleMarkerDragEnd = (event: google.maps.MapMouseEvent) => {
		const newPosition = {
			lat: event.latLng!.lat(),
			lng: event.latLng!.lng(),
		};
		setLiteralLocation(event.latLng);
		setSelectedPosition(newPosition);
	};

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const userLatLng = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					};
					setSelectedPosition(userLatLng);
					map?.panTo(userLatLng);
				},
				() => {
					setSelectedPosition(center);
					map?.panTo(center);
				},
			);
		} else {
			alert("La geolocalización no está soportada por este navegador.");
			setSelectedPosition(center);
			map?.panTo(center);
		}
	}, [map]);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "100%",
			}}
		>
			<Container
				sx={{
					flex: 1,
					overflowY: "auto",
					padding: 0,
					position: "relative",
				}}
			>
				<Box
					sx={{
						backgroundColor: "white",
						position: "absolute",
						top: "48px",
						zIndex: "1",
						width: "80%",
						left: "10%",
					}}
				>
					<Autocomplete
						onLoad={handleLoadAutocomplete}
						onPlaceChanged={handlePlaceChanged}
					>
						<TextField
							type="text"
							id="outlined-basic"
							placeholder="Introduce your crop location"
							sx={{
								width: "100%",
							}}
							variant="filled"
							className={styles.inputContainer}
						/>
					</Autocomplete>
				</Box>
				<GoogleMap
					mapContainerStyle={mapContainerStyle}
					center={selectedPosition || center}
					zoom={14}
					onLoad={handleLoadMap}
					onClick={handleMapClick}
					options={{
						mapTypeId: "hybrid",
						streetViewControl: false,
						mapTypeControl: false,
						clickableIcons: false,
					}}
				>
					{selectedPosition && (
						<Marker
							position={selectedPosition}
							draggable={true}
							onDragEnd={handleMarkerDragEnd}
						/>
					)}
				</GoogleMap>
				{selectedPosition && (
					<>
						<CssBaseline />
						<Container
							fixed
							sx={{
								width: "100%",
								padding: "0",
								position: "absolute",
								bottom: "0",
								paddingBottom: "16px",
								bgcolor: "white",
								textAlign: "left",
								paddingX: "24px",
								paddingY: "24px",
							}}
						>
							<p>
								{selectedPosition.lat.toFixed(6)},{" "}
								{selectedPosition.lng.toFixed(6)}{" "}
							</p>
							<Button
								variant="contained"
								onClick={() => onLocationChange(literalLocation)}
								sx={{
									width: "100%",
								}}
							>
								MEASURE YOUR CROP
							</Button>
						</Container>
					</>
				)}
			</Container>
		</Box>
	);
};

export default GoogleMapWithMarkerControl;
